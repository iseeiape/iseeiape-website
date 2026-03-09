// Simple test using curl to check WEN token
const { execSync } = require('child_process');

try {
  console.log('Testing WEN token fetch from DexScreener...');
  const result = execSync('curl -s "https://api.dexscreener.com/latest/dex/search?q=WEN"', { encoding: 'utf8' });
  const data = JSON.parse(result);
  
  console.log('Status: Success');
  console.log('Number of pairs:', data.pairs?.length || 0);
  
  if (data.pairs && data.pairs.length > 0) {
    const pair = data.pairs[0];
    console.log('\nFirst pair details:');
    console.log('Symbol:', pair.baseToken?.symbol);
    console.log('Price USD:', pair.priceUsd);
    console.log('Price Change 24h:', pair.priceChange?.h24);
    console.log('Volume 24h:', pair.volume?.h24);
    console.log('Liquidity USD:', pair.liquidity?.usd);
    console.log('DEX:', pair.dexId);
  } else {
    console.log('No pairs found for WEN token');
  }
} catch (error) {
  console.error('Error:', error.message);
}