import Layout from '../../components/Layout'
import Head from 'next/head'

export default function BuildingTradingBot() {
  return (
    <Layout 
      title="Building Your First Trading Bot | iseeiape Guides"
      description="Step-by-step guide to building a crypto trading bot. No coding experience required - just copy, paste, and customize."
      breadcrumbs={[{ name: 'Guides', path: '/guides' }, { name: 'Trading Bot', path: '/guides/building-your-first-trading-bot' }]}
    >
      <Head>
        <title>Building Your First Trading Bot | iseeiape Guides</title>
        <meta name="description" content="Step-by-step guide to building a crypto trading bot. No coding experience required - just copy, paste, and customize." />
      </Head>
      
      <article className="article">
        <header className="article-header">
          <span className="tag">Guide</span>
          <h1>Building Your First Trading Bot</h1>
          <p className="article-subtitle">From zero to automated trading in 60 minutes</p>
          <div className="article-meta">
            <span>📚 Guide</span>
            <span>⏱️ 15 min read</span>
            <span>🎯 Intermediate</span>
          </div>
        </header>

        <div className="article-content">
          <h2>Why Build a Bot?</h2>
          <p>Manual trading has limits:</p>
          <ul>
            <li>You sleep, markets don't</li>
            <li>Emotions make you FOMO or panic sell</li>
            <li>Can't watch 100 tokens simultaneously</li>
            <li>Reaction time is too slow</li>
          </ul>
          
          <p>Bots solve all of this. They execute your strategy 24/7 without emotion.</p>

          <h2>What You'll Build</h2>
          
          <p>A simple bot that:</p>
          <ul>
            <li>Monitors Wolf Alerts for high-confidence signals</li>
            <li>Auto-buys when score >= 90</li>
            <li>Sets stop loss at -15%</li>
            <li>Takes profit at +50%, +100%, +200%</li>
            <li>Sends Telegram notifications</li>
          </ul>

          <h2>Prerequisites</h2>
          
          <ul>
            <li>Python 3.8+ installed</li>
            <li>Basic Python syntax knowledge</li>
            <li>Solana wallet with small amount for testing (0.5 SOL max)</li>
            <li>Telegram bot token (free)</li>
          </ul>

          <h2>Step 1: Project Setup</h2>

          <pre className="code-block">
{
`mkdir wolf-bot
cd wolf-bot
python3 -m venv venv
source venv/bin/activate
pip install requests python-telegram-bot solana`
}
          </pre>

          <h2>Step 2: The Core Bot</h2>

          <pre className="code-block">
{
`# bot.py
import requests
import time
import os
from telegram import Bot

# Config
TELEGRAM_TOKEN = "YOUR_BOT_TOKEN"
TELEGRAM_CHAT_ID = "YOUR_CHAT_ID"
MIN_SCORE = 90
CHECK_INTERVAL = 300  # 5 minutes

class WolfBot:
    def __init__(self):
        self.bot = Bot(token=TELEGRAM_TOKEN)
        self.seen_tokens = set()
    
    def get_wolf_alerts(self):
        """Fetch latest Wolf alerts"""
        try:
            response = requests.get(
                "https://www.iseeiape.com/api/market-data",
                timeout=10
            )
            return response.json()
        except Exception as e:
            print(f"Error fetching alerts: {e}")
            return None
    
    def check_for_opportunities(self):
        """Check for high-confidence trades"""
        data = self.get_wolf_alerts()
        if not data:
            return
        
        for token in data.get('topTokens', []):
            if token['score'] >= MIN_SCORE and token['symbol'] not in self.seen_tokens:
                self.execute_trade(token)
                self.seen_tokens.add(token['symbol'])
    
    def execute_trade(self, token):
        """Execute trade logic (example - customize for your DEX)"""
        message = f"""
🚨 HIGH CONFIDENCE ALERT

Token: ${token['symbol']}
Score: {token['score']}/100
Price: ${token['price']:.8f}
24h Change: {token['priceChange24h']:+.1f}%

📊 Stats:
• Volume: ${token['volume24h']:,.0f}
• Liquidity: ${token['liquidity']:,.0f}

⚡ Action:
• Entry: Market buy 0.1 SOL worth
• Stop Loss: -15%
• Take Profit: +50%, +100%, +200%
        """
        
        # Send Telegram alert
        self.bot.send_message(
            chat_id=TELEGRAM_CHAT_ID,
            text=message
        )
        
        print(f"Alert sent for ${token['symbol']}")
    
    def run(self):
        """Main loop"""
        print("🐺 Wolf Bot started...")
        self.bot.send_message(
            chat_id=TELEGRAM_CHAT_ID,
            text="🐺 Wolf Bot is now monitoring for high-confidence alerts!"
        )
        
        while True:
            try:
                self.check_for_opportunities()
                time.sleep(CHECK_INTERVAL)
            except Exception as e:
                print(f"Error in main loop: {e}")
                time.sleep(60)

if __name__ == "__main__":
    bot = WolfBot()
    bot.run()`
}
          </pre>

          <h2>Step 3: Add DEX Integration</h2>

          <p>The above bot alerts you. To auto-trade, add DEX integration:</p>

          <pre className="code-block">
{
`# Add to WolfBot class:

def buy_token(self, token_address, amount_sol):
    """Execute buy on Jupiter DEX"""
    # Using Jupiter API
    quote_url = f"https://quote-api.jup.ag/v6/quote"
    params = {
        "inputMint": "So11111111111111111111111111111111111111112",  # SOL
        "outputMint": token_address,
        "amount": int(amount_sol * 1e9),  # lamports
        "slippageBps": 150  # 1.5% slippage
    }
    
    response = requests.get(quote_url, params=params)
    quote = response.json()
    
    # Execute swap (requires wallet signing)
    # This is where you'd use your wallet private key
    # ⚠️ NEVER commit private keys to git!
    
    return quote`
}
          </pre>

          <h2>Step 4: Deploy</h2>

          <p>Options for running 24/7:</p>

          <h3>Option A: Your Computer</h3>
          <p>Just run: <code>python bot.py</code></p>
          <p>Downside: Computer must stay on</p>

          <h3>Option B: Raspberry Pi</h3>
          <p>$50 one-time cost, runs 24/7 silently</p>

          <h3>Option C: VPS (Recommended)</h3>
          <ul>
            <li>DigitalOcean: $5/month</li>
            <li>AWS EC2: Free tier available</li>
            <li>Hetzner: €3/month</li>
          </ul>

          <pre className="code-block">
{
`# Deploy script (deploy.sh)
#!/bin/bash
git clone https://github.com/yourusername/wolf-bot.git
cd wolf-bot
pip install -r requirements.txt
pm2 start bot.py --name "wolf-bot"`
}
          </pre>

          <h2>Step 5: Risk Management</h2>

          <p>Add safeguards:</p>

          <pre className="code-block">
{
`# Safety limits
MAX_DAILY_TRADES = 5
MAX_POSITION_SIZE_SOL = 0.5
STOP_LOSS_PERCENT = -15
TAKE_PROFIT_LEVELS = [50, 100, 200]  # %

class SafetyManager:
    def __init__(self):
        self.daily_trades = 0
        self.positions = {}
    
    def can_trade(self):
        if self.daily_trades >= MAX_DAILY_TRADES:
            return False, "Daily trade limit reached"
        return True, "OK"
    
    def check_stop_losses(self):
        for token, entry_price in self.positions.items():
            current_price = get_current_price(token)
            pnl = (current_price - entry_price) / entry_price * 100
            
            if pnl <= STOP_LOSS_PERCENT:
                self.execute_sell(token, "Stop loss hit")
                send_alert(f"🛑 Stop loss hit for ${token}: {pnl:.1f}%")`
}
          </pre>

          <h2>Testing Your Bot</h2>

          <ol>
            <li><strong>Paper trade first:</strong> Log trades without executing</li>
            <li><strong>Small size test:</strong> 0.01 SOL positions for a week</li>
            <li><strong>Monitor alerts:</strong> Make sure Telegram works</li>
            <li><strong>Check logs:</strong> Debug any errors</li>
          </ol>

          <h2>Common Issues</h2>

          <ul>
            <li><strong>RPC rate limits:</strong> Use Helius or QuickNode paid plans</li>
            <li><strong>Slippage:</strong> Increase to 2-3% for micro caps</li>
            <li><strong>Failed transactions:</strong> Check priority fees</li>
            <li><strong>Bot crashes:</strong> Use try/except and auto-restart</li>
          </ul>

          <h2>Next Steps</h2>

          <p>Once basic bot works, add:</p>
          
          <ul>
            <li>Multiple DEX support (Jupiter, Raydium, Orca)</li>
            <li>Portfolio tracking and P&L reporting</li>
            <li>Machine learning for signal filtering</li>
            <li>Web dashboard for monitoring</li>
          </ul>

          <div className="article-cta">
            <h3>Want a Head Start?</h3>
            <p>Our <a href="/case-studies">Case Studies</a> show real bot implementations. Learn from working code.</p>
          </div>
        </div>
      </article>
    </Layout>
  )
}
