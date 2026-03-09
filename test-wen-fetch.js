const axios = require('./neo-crypto/node_modules/axios');

async function testWEN() {
  try {
    const url = `https://api.dexscreener.com/latest/dex/search?q=WEN`;
    const response = await axios.get(url);
    
    console.log('Response status:', response.status);
    console.log('Has data:', !!response.data);
    console.log('Has pairs:', response.data?.pairs?.length);
    
    if (response.data?.pairs?.length > 0) {
      const pair = response.data.pairs[0];
      console.log('First pair:', {
        symbol: pair.baseToken?.symbol,
        priceUsd: pair.priceUsd,
        priceChange: pair.priceChange?.h24,
        volume: pair.volume?.h24,
        liquidity: pair.liquidity?.usd,
        dexId: pair.dexId
      });
    } else {
      console.log('No pairs found for WEN');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testWEN();