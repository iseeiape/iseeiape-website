#!/usr/bin/env node

/**
 * 🦎 NEO CRYPTO ALPHA GENERATOR
 * 
 * Automatically generates crypto content using templates
 * and simulated on-chain data for testing.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const CONFIG_PATH = path.join(__dirname, '../config/neo-config.json');
const TEMPLATES_DIR = path.join(__dirname, '../templates');
const OUTPUT_DIR = path.join(__dirname, '../outputs/scheduled-posts');
const DATA_DIR = path.join(__dirname, '../data');

// Ensure directories exist
[OUTPUT_DIR, DATA_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Sample data for content generation
const SAMPLE_WHALES = [
  { name: "Solana Whale", address: "7uy4...Xz9q", successRate: 0.78 },
  { name: "Meme Coin King", address: "aBc3...DeF9", successRate: 0.82 },
  { name: "DeFi Degenerate", address: "XyZ1...2345", successRate: 0.65 },
  { name: "NFT Flipper", address: "6789...WxYz", successRate: 0.71 },
  { name: "Institutional Wallet", address: "Inst...Wall", successRate: 0.88 }
];

const SAMPLE_TOKENS = [
  { symbol: "SOL", name: "Solana", price: 112.45 },
  { symbol: "BONK", name: "Bonk", price: 0.000023 },
  { symbol: "JUP", name: "Jupiter", price: 0.85 },
  { symbol: "RAY", name: "Raydium", price: 1.45 },
  { symbol: "PYTH", name: "Pyth Network", price: 0.62 },
  { symbol: "JTO", name: "Jito", price: 3.21 }
];

const SAMPLE_NARRATIVES = [
  "AI agents",
  "Real World Assets (RWA)",
  "DePIN",
  "Gaming",
  "Meme coins",
  "DeFi 2.0",
  "Layer 2 solutions",
  "Privacy"
];

// Helper functions
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomAmount(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatUSD(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function formatPercentage(value) {
  return `${(value * 100).toFixed(0)}%`;
}

function getTimestamp() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function getRelativeTime() {
  const times = ["15 minutes ago", "1 hour ago", "2 hours ago", "4 hours ago", "earlier today"];
  return getRandomItem(times);
}

// Content generation functions
function generateWhaleAlert() {
  const whale = getRandomItem(SAMPLE_WHALES);
  const token = getRandomItem(SAMPLE_TOKENS);
  const amount = getRandomAmount(50000, 2500000);
  const action = getRandomItem(["bought", "sold", "transferred"]);
  
  return `🚨 WHALE ALERT 🚨

${whale.name} (${whale.address}) just ${action} ${formatUSD(amount)} of ${token.symbol}

• Token: ${token.name} (${token.symbol})
• Amount: ${formatUSD(amount)}
• Price: $${token.price.toFixed(token.price < 1 ? 6 : 2)}
• Time: ${getRelativeTime()}

This whale has a ${formatPercentage(whale.successRate)} success rate on recent trades.
The ${action === 'bought' ? 'accumulation' : 'distribution'} suggests ${action === 'bought' ? 'bullish' : 'cautious'} sentiment.

#Solana #${token.symbol} #WhaleAlert`;
}

function generateTrendAlert() {
  const narrative = getRandomItem(SAMPLE_NARRATIVES);
  const volumeIncrease = getRandomAmount(150, 500);
  const mentionsIncrease = getRandomAmount(100, 300);
  const newWallets = getRandomAmount(500, 2000);
  
  // Get 3 random tokens for this narrative
  const relatedTokens = [];
  while (relatedTokens.length < 3) {
    const token = getRandomItem(SAMPLE_TOKENS);
    if (!relatedTokens.includes(token.symbol)) {
      relatedTokens.push(token.symbol);
    }
  }
  
  return `🌊 TREND EMERGING 🌊

The ${narrative} narrative is gaining serious momentum.

• Volume: Up ${volumeIncrease}% in 24h
• Social mentions: ${mentionsIncrease}% increase
• New wallets: ${newWallets.toLocaleString()} entering
• Key tokens: $${relatedTokens.join(', $')}

This looks like early-stage accumulation.
Similar patterns preceded the last ${getRandomItem(["DeFi", "NFT", "Gaming"])} boom.

Whales are positioning quietly while retail sleeps.
Follow @iseeicode for real-time alpha.

#Crypto #${narrative.replace(/\s+/g, '')} #Alpha`;
}

function generateDailyAlpha() {
  const topGainer = getRandomItem(SAMPLE_TOKENS.filter(t => t.symbol !== "SOL"));
  const topLoser = getRandomItem(SAMPLE_TOKENS.filter(t => t.symbol !== topGainer.symbol && t.symbol !== "SOL"));
  const gain = getRandomAmount(15, 45);
  const loss = getRandomAmount(5, 20);
  
  const watchlist = [];
  while (watchlist.length < 3) {
    const token = getRandomItem(SAMPLE_TOKENS);
    if (!watchlist.includes(token.symbol) && token.symbol !== topGainer.symbol && token.symbol !== topLoser.symbol) {
      watchlist.push(token.symbol);
    }
  }
  
  return `📊 DAILY ALPHA - ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', 'day': 'numeric' })}

**Market Snapshot:**
• Top Gainer: $${topGainer.symbol} +${gain}%
• Top Loser: $${topLoser.symbol} -${loss}%
• SOL: $${SAMPLE_TOKENS.find(t => t.symbol === "SOL").price} (${getRandomItem(["+2.3%", "-1.1%", "+0.8%"])})

**Watchlist:**
1. $${watchlist[0]} - ${getRandomItem(["Breaking out", "Consolidating", "Testing support"])}
2. $${watchlist[1]} - ${getRandomItem(["Whale accumulation", "High volume", "News pending"])}
3. $${watchlist[2]} - ${getRandomItem(["Undervalued", "Technical setup", "Community growing"])}

**Today's Focus:**
${getRandomItem(SAMPLE_NARRATIVES)} showing strength.
Look for pullbacks to enter.

Not financial advice. Always DYOR.

#Crypto #Trading #Solana #${watchlist.map(t => t).join(' #')}`;
}

function generateThread() {
  const topic = getRandomItem([
    "How to spot whale accumulation",
    "The 3 phases of a crypto pump",
    "Why most traders lose money",
    "My framework for finding alpha"
  ]);
  
  return `🧵 THREAD: ${topic}

1/ Most traders focus on price.
Smart money watches wallet flows.
The difference? 90% of traders lose.
Here's how to be in the 10%:

2/ Track these 3 wallet types:
• Early buyers (pre-listing)
• Market makers (liquidity providers)  
• Successful traders (consistent wins)

3/ Use @CieloFinance (free tier works).
Set alerts for:
• $10k+ transactions
• New token buys
• Wallet-to-wallet transfers

4/ Look for patterns:
• Accumulation over days/weeks
• Multiple wallets buying same token
• Transfers to/from known entities

5/ Combine with:
• Social sentiment (growing mentions)
• Development activity (GitHub commits)
• Exchange listings (upcoming)

6/ My process:
1. Scan for unusual volume
2. Check wallet flows
3. Verify fundamentals
4. Wait for confirmation
5. Position size appropriately

7/ Most important rule:
Risk management > everything.
Never bet more than you can lose.
Take profits along the way.

8/ Tools I use:
• @CieloFinance - Wallet tracking
• @DexScreener - Price charts
• @BirdeyeSo - Token analytics
• @DuneAnalytics - On-chain queries

9/ Follow @iseeicode for:
• Daily whale alerts
• Emerging trend signals
• Alpha threads like this
• Real-time market insights

10/ Like/retweet if helpful!
Question? Drop it below 👇

#Crypto #Trading #Alpha #Solana #Thread`;
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    type: 'all', // all, whale_alert, trend_alert, daily_alpha, thread
    count: 1,
    output: OUTPUT_DIR,
    dryRun: false
  };
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--type' || arg === '-t') {
      options.type = args[++i];
    } else if (arg === '--count' || arg === '-c') {
      options.count = parseInt(args[++i], 10);
    } else if (arg === '--output' || arg === '-o') {
      options.output = args[++i];
    } else if (arg === '--dry-run' || arg === '-d') {
      options.dryRun = true;
    } else if (arg === '--help' || arg === '-h') {
      console.log(`
🦎 NEO CRYPTO ALPHA GENERATOR - Usage

Options:
  --type, -t <type>    Content type: all, whale_alert, trend_alert, daily_alpha, thread
  --count, -c <number> Number of posts to generate (default: 1)
  --output, -o <path>  Output directory (default: ${OUTPUT_DIR})
  --dry-run, -d        Generate without saving files
  --help, -h           Show this help

Examples:
  node alpha-generator.js --type whale_alert --count 3
  node alpha-generator.js --type daily_alpha
  node alpha-generator.js --dry-run
`);
      process.exit(0);
    }
  }
  
  return options;
}

// Content type mapping
const CONTENT_TYPES = {
  whale_alert: { name: "Whale Alert", generator: generateWhaleAlert },
  trend_alert: { name: "Trend Alert", generator: generateTrendAlert },
  daily_alpha: { name: "Daily Alpha", generator: generateDailyAlpha },
  thread: { name: "Educational Thread", generator: generateThread }
};

// Main execution
function main() {
  const options = parseArgs();
  
  console.log("🦎 NEO CRYPTO ALPHA GENERATOR");
  console.log("=".repeat(50));
  console.log(`Type: ${options.type}`);
  console.log(`Count: ${options.count}`);
  console.log(`Output: ${options.output}`);
  console.log(`Dry run: ${options.dryRun}`);
  console.log("=".repeat(50));
  
  // Determine which content types to generate
  let typesToGenerate = [];
  if (options.type === 'all') {
    typesToGenerate = Object.values(CONTENT_TYPES);
  } else if (CONTENT_TYPES[options.type]) {
    typesToGenerate = [CONTENT_TYPES[options.type]];
  } else {
    console.error(`❌ Unknown content type: ${options.type}`);
    console.error(`   Available types: ${Object.keys(CONTENT_TYPES).join(', ')}`);
    process.exit(1);
  }
  
  const generatedContent = [];
  let postIndex = 0;
  
  // Generate content
  for (let i = 0; i < options.count; i++) {
    typesToGenerate.forEach((type) => {
      console.log(`\n📝 Generating ${type.name} ${i + 1}/${options.count}...`);
      const content = type.generator();
      generatedContent.push({
        type: type.name,
        content: content,
        timestamp: new Date().toISOString(),
        length: content.length,
        batch: i + 1
      });
      
      console.log(`✅ Generated ${type.name} (${content.length} chars)`);
      
      if (!options.dryRun) {
        // Save to file
        const filename = `post_${Date.now()}_${postIndex++}.txt`;
        const filepath = path.join(options.output, filename);
        fs.writeFileSync(filepath, content);
        console.log(`💾 Saved to: ${filename}`);
      }
    });
  }
  
  // Save metadata
  const metadata = {
    generated_at: new Date().toISOString(),
    total_posts: generatedContent.length,
    posts: generatedContent,
    next_scheduled: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString() // 4 hours from now
  };
  
  const metadataFile = path.join(OUTPUT_DIR, `metadata_${Date.now()}.json`);
  fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
  
  // Update content history
  const historyFile = path.join(DATA_DIR, 'content-history.json');
  let history = [];
  if (fs.existsSync(historyFile)) {
    history = JSON.parse(fs.readFileSync(historyFile, 'utf8'));
  }
  
  history.push({
    batch_id: Date.now(),
    generated_at: new Date().toISOString(),
    post_count: generatedContent.length,
    post_types: generatedContent.map(p => p.type)
  });
  
  // Keep only last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  history = history.filter(h => new Date(h.generated_at) > thirtyDaysAgo);
  
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
  
  console.log("\n" + "=".repeat(50));
  console.log("✅ CONTENT GENERATION COMPLETE");
  console.log("=".repeat(50));
  console.log(`\n📊 Summary:`);
  console.log(`• Generated ${generatedContent.length} posts`);
  console.log(`• Saved to: ${OUTPUT_DIR}/`);
  console.log(`• History updated: ${DATA_DIR}/content-history.json`);
  console.log(`\n🎯 Next batch scheduled for: ${new Date(metadata.next_scheduled).toLocaleTimeString()}`);
  
  // Show preview of first post
  if (generatedContent.length > 0) {
    console.log("\n🔍 Preview of first post:");
    console.log("-".repeat(50));
    const preview = generatedContent[0].content.split('\n').slice(0, 8).join('\n');
    console.log(preview);
    console.log("...");
    console.log("-".repeat(50));
  }
}

// Run if called directly
if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

module.exports = {
  generateWhaleAlert,
  generateTrendAlert,
  generateDailyAlpha,
  generateThread
};