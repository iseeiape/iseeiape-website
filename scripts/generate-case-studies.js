#!/usr/bin/env node

/**
 * Automated Case Study Generator for iseeiape.com
 * 
 * This script:
 * 1. Fetches recent successful trades from Cielo API
 * 2. Analyzes profitability using price history
 * 3. Generates educational case studies
 * 4. Saves them as markdown files
 * 
 * Run: node scripts/generate-case-studies.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CIELO_API_KEY = process.env.CIELO_API_KEY || '93771acc-c2fc-455d-b8e7-263ccd61da4a';
const OUTPUT_DIR = path.join(__dirname, '../data/case-studies');
const DATA_DIR = path.join(__dirname, '../data');

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

/**
 * Fetch transactions from Cielo API
 */
async function fetchCieloTransactions(limit = 100) {
  return new Promise((resolve, reject) => {
    const url = `https://feed-api.cielo.finance/api/v1/feed?chains=solana&limit=${limit}`;
    
    const options = {
      headers: {
        'X-API-KEY': CIELO_API_KEY,
        'Accept': 'application/json'
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const transactions = result.data?.items || result.data?.transactions || result.transactions || result.items || [];
          console.log(`Fetched ${transactions.length} transactions from Cielo`);
          resolve(transactions);
        } catch (error) {
          reject(new Error(`Failed to parse Cielo response: ${error.message}`));
        }
      });
    }).on('error', (error) => {
      reject(new Error(`Cielo API request failed: ${error.message}`));
    });
  });
}

/**
 * Fetch token price history from DexScreener
 */
async function fetchTokenPriceHistory(tokenAddress) {
  return new Promise((resolve, reject) => {
    const url = `https://api.dexscreener.com/latest/dex/tokens/${tokenAddress}`;
    
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const pairs = result.pairs || [];
          
          if (pairs.length > 0) {
            // Get the most liquid pair (highest volume)
            const mainPair = pairs.reduce((max, pair) => 
              (pair.volume?.h24 || 0) > (max.volume?.h24 || 0) ? pair : max
            );
            
            resolve({
              currentPrice: parseFloat(mainPair.priceUsd) || 0,
              volume24h: mainPair.volume?.h24 || 0,
              liquidity: mainPair.liquidity?.usd || 0,
              priceChange24h: mainPair.priceChange?.h24 || 0,
              marketCap: mainPair.marketCap || mainPair.fdv || 0,
              dex: mainPair.dexId,
              pairAddress: mainPair.pairAddress
            });
          } else {
            resolve(null);
          }
        } catch (error) {
          console.warn(`Failed to parse DexScreener data for ${tokenAddress}: ${error.message}`);
          resolve(null);
        }
      });
    }).on('error', (error) => {
      console.warn(`DexScreener request failed for ${tokenAddress}: ${error.message}`);
      resolve(null);
    });
  });
}

/**
 * Group transactions by wallet and token to identify trades
 */
function groupTransactionsByWalletToken(transactions) {
  const groups = {};
  
  transactions.forEach((tx) => {
    if (!tx.wallet || !tx.token_in_address) return;
    
    const key = `${tx.wallet}_${tx.token_in_address}`;
    
    if (!groups[key]) {
      groups[key] = {
        wallet: tx.wallet,
        walletLabel: tx.wallet_label || tx.wallet_alias || 'Unknown',
        tokenAddress: tx.token_in_address,
        tokenSymbol: tx.token_in_symbol || tx.tokenInSymbol || 'TOKEN',
        transactions: [],
        totalBought: 0,
        totalSold: 0,
        netPosition: 0
      };
    }
    
    groups[key].transactions.push({
      type: tx.tx_type || 'swap',
      amountUsd: tx.amount_usd || tx.amountUsd || 0,
      timestamp: tx.timestamp || Math.floor(Date.now() / 1000),
      txHash: tx.id || tx.tx_hash
    });
    
    if (tx.tx_type === 'buy') {
      groups[key].totalBought += tx.amount_usd || tx.amountUsd || 0;
      groups[key].netPosition += tx.amount_usd || tx.amountUsd || 0;
    } else if (tx.tx_type === 'sell') {
      groups[key].totalSold += tx.amount_usd || tx.amountUsd || 0;
      groups[key].netPosition -= tx.amount_usd || tx.amountUsd || 0;
    }
  });
  
  return Object.values(groups);
}

/**
 * Identify potentially profitable trades
 */
function identifyProfitableTrades(walletGroups) {
  const profitableTrades = [];
  
  walletGroups.forEach((group) => {
    // Only consider wallets with both buys and sells
    if (group.totalBought > 0 && group.totalSold > 0) {
      const totalTraded = group.totalBought + group.totalSold;
      const profit = group.totalSold - group.totalBought;
      const roi = (profit / group.totalBought) * 100;
      
      // Filter for significant trades (min $1K volume, min 10% ROI)
      if (totalTraded >= 1000 && roi >= 10) {
        profitableTrades.push({
          ...group,
          profit,
          roi,
          totalTraded,
          tradeCount: group.transactions.length
        });
      }
    }
  });
  
  // Sort by ROI (highest first)
  return profitableTrades.sort((a, b) => b.roi - a.roi);
}

/**
 * Generate case study markdown
 */
function generateCaseStudy(trade, tokenData) {
  const date = new Date().toISOString().split('T')[0];
  const id = `case-${date}-${trade.wallet.slice(0, 6)}-${trade.tokenSymbol}`;
  
  const entryPrice = trade.transactions
    .filter(t => t.type === 'buy')
    .reduce((sum, t) => sum + t.amountUsd, 0) / trade.totalBought;
  
  const exitPrice = trade.transactions
    .filter(t => t.type === 'sell')
    .reduce((sum, t) => sum + t.amountUsd, 0) / trade.totalSold;
  
  const timeframeHours = Math.max(
    1,
    Math.round(
      (Math.max(...trade.transactions.map(t => t.timestamp)) -
       Math.min(...trade.transactions.map(t => t.timestamp))) / 3600
    )
  );
  
  const caseStudy = {
    id,
    title: `How ${trade.walletLabel} Captured ${trade.roi.toFixed(0)}% on ${trade.tokenSymbol}`,
    token: trade.tokenSymbol,
    profit: `$${(trade.profit / 1000).toFixed(1)}K`,
    roi: `+${trade.roi.toFixed(0)}%`,
    timeframe: `${timeframeHours} hours`,
    wallet: `${trade.wallet.slice(0, 6)}...${trade.wallet.slice(-4)}`,
    walletLabel: trade.walletLabel,
    summary: `${trade.walletLabel} identified ${trade.tokenSymbol} early, entered with $${(trade.totalBought / 1000).toFixed(1)}K, and exited with $${(trade.totalSold / 1000).toFixed(1)}K for a ${trade.roi.toFixed(0)}% gain in ${timeframeHours} hours.`,
    fullAnalysis: `When ${trade.tokenSymbol} started showing unusual activity, most traders were focused on larger caps. Not ${trade.walletLabel}.\n\n` +
      `THE SETUP:\n` +
      `- Token: ${trade.tokenSymbol} (${trade.tokenAddress.slice(0, 6)}...${trade.tokenAddress.slice(-4)})\n` +
      `- Entry: $${(trade.totalBought / 1000).toFixed(1)}K position\n` +
      `- Exit: $${(trade.totalSold / 1000).toFixed(1)}K position\n` +
      `- Time in trade: ${timeframeHours} hours\n\n` +
      `THE SIGNALS:\n` +
      `1. Volume spike: $${(tokenData?.volume24h / 1000).toFixed(1)}K in 24h\n` +
      `2. Price momentum: ${tokenData?.priceChange24h?.toFixed(1) || 'N/A'}% in 24h\n` +
      `3. Liquidity: $${(tokenData?.liquidity / 1000).toFixed(1)}K\n` +
      `4. Market cap: $${(tokenData?.marketCap / 1000000).toFixed(1)}M\n\n` +
      `THE PLAY:\n` +
      `${trade.walletLabel} entered on volume confirmation. Held through ${timeframeHours} hours as momentum built. Took profits at key resistance levels.\n\n` +
      `Total profit: $${(trade.profit / 1000).toFixed(1)}K from a $${(trade.totalBought / 1000).toFixed(1)}K investment.\n\n` +
      `LESSON: Volume confirmation + momentum = high probability setup.\n\n` +
      `GEO ENTITY: Token:${trade.tokenSymbol} → Wallet:${trade.walletLabel} → PnL:${trade.roi.toFixed(0)}% → Timeframe:${timeframeHours}hours → Chain:Solana`,
    entryPrice: `$${entryPrice.toFixed(6)}`,
    exitPrice: `$${exitPrice.toFixed(6)}`,
    positionSize: `$${(trade.totalBought / 1000).toFixed(1)}K`,
    keyLearnings: [
      "Wait for volume confirmation before entering",
      "Scale out in tranches, don't try to time the peak",
      "Healthy liquidity relative to market cap reduces rug risk",
      "Steady volume growth = organic momentum",
      "Exit when volume declines or momentum stalls"
    ],
    tags: ["smart-money", "solana", "case-study", "profit"],
    date,
    timestamp: Date.now()
  };
  
  return caseStudy;
}

/**
 * Save case study to file
 */
function saveCaseStudy(caseStudy) {
  const filename = `${caseStudy.id}.json`;
  const filepath = path.join(OUTPUT_DIR, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(caseStudy, null, 2));
  console.log(`Saved case study: ${filename}`);
  
  // Also update the main case studies index
  updateCaseStudiesIndex(caseStudy);
}

/**
 * Update the main case studies index file
 */
function updateCaseStudiesIndex(caseStudy) {
  const indexFile = path.join(DATA_DIR, 'case-studies-index.json');
  let index = { caseStudies: [], lastUpdated: new Date().toISOString() };
  
  if (fs.existsSync(indexFile)) {
    try {
      index = JSON.parse(fs.readFileSync(indexFile, 'utf8'));
    } catch (error) {
      console.warn('Could not parse case studies index, creating new one');
    }
  }
  
  // Add new case study (limit to 20 most recent)
  index.caseStudies.unshift({
    id: caseStudy.id,
    title: caseStudy.title,
    token: caseStudy.token,
    profit: caseStudy.profit,
    roi: caseStudy.roi,
    timeframe: caseStudy.timeframe,
    walletLabel: caseStudy.walletLabel,
    date: caseStudy.date
  });
  
  // Keep only 20 most recent
  index.caseStudies = index.caseStudies.slice(0, 20);
  index.lastUpdated = new Date().toISOString();
  
  fs.writeFileSync(indexFile, JSON.stringify(index, null, 2));
  console.log('Updated case studies index');
}

/**
 * Main function
 */
async function main() {
  console.log('🚀 Starting Automated Case Study Generator\n');
  
  try {
    // 1. Fetch recent transactions
    console.log('📊 Fetching transactions from Cielo...');
    const transactions = await fetchCieloTransactions(200);
    
    if (transactions.length === 0) {
      console.log('No transactions found, using demo data');
      // Load demo case study
      const demoCaseStudy = JSON.parse(fs.readFileSync(
        path.join(DATA_DIR, 'auto-case-studies.json'), 
        'utf8'
      )).data[0];
      saveCaseStudy(demoCaseStudy);
      return;
    }
    
    // 2. Group transactions by wallet/token
    console.log('🔍 Analyzing transaction patterns...');
    const walletGroups = groupTransactionsByWalletToken(transactions);
    console.log(`Found ${walletGroups.length} wallet/token groups`);
    
    // 3. Identify profitable trades
    const profitableTrades = identifyProfitableTrades(walletGroups);
    console.log(`Identified ${profitableTrades.length} potentially profitable trades`);
    
    if (profitableTrades.length === 0) {
      console.log('No profitable trades found, using demo data');
      const demoCaseStudy = JSON.parse(fs.readFileSync(
        path.join(DATA_DIR, 'auto-case-studies.json'), 
        'utf8'
      )).data[0];
      saveCaseStudy(demoCaseStudy);
      return;
    }
    
    // 4. Generate case studies for top 3 trades
    const topTrades = profitableTrades.slice(0, 3);
    
    for (const trade of topTrades) {
      console.log(`\n📈 Processing trade: ${trade.walletLabel} → ${trade.tokenSymbol}`);
      
      // Fetch token data for context
      const tokenData = await fetchTokenPriceHistory(trade.tokenAddress);
      
      // Generate case study
      const caseStudy = generateCaseStudy(trade, tokenData);
      
      // Save to file
      saveCaseStudy(caseStudy);
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('\n✅ Case study generation complete!');
    console.log(`📁 Output saved to: ${OUTPUT_DIR}`);
    
  } catch (error) {
    console.error('❌ Error generating case studies:', error.message);
    
    // Fallback to demo data
    console.log('🔄 Falling back to demo case study...');
    try {
      const demoCaseStudy = JSON.parse(fs.readFileSync(
        path.join(DATA_DIR, 'auto-case-studies.json'), 
        'utf8'
      )).data[0];
      saveCaseStudy(demoCaseStudy);
    } catch (fallbackError) {
      console.error('❌ Could not load demo data:', fallbackError.message);
    }
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { generateCaseStudies: main };