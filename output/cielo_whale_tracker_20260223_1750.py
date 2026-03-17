#!/usr/bin/env python3
"""
🦈 CIELO WHALE TRACKER
Auto-generated tracking script for whale wallets
"""

import requests
import json
import time
from datetime import datetime
import os

# Cielo API Configuration
CIELO_API_KEY = os.environ.get("CIELO_API_KEY", "e7a2bb7b-73f0-4362-bf3f-7b9e276f9695")
CIELO_BASE_URL = "https://feed-api.cielo.finance/api/v1"

# Telegram Configuration
TELEGRAM_BOT_TOKEN = os.environ.get("TELEGRAM_BOT_TOKEN", "YOUR_BOT_TOKEN")
TELEGRAM_CHAT_ID = "120001865"  # Dan's chat ID

# Whale wallets to track
WHALE_WALLETS = [
    "ewRUacn951XK2Lk7VUBhVyXYLBv9QrpLndRpKWebTgdt",  # Whale 1
    "mVBvHZw4n3E4ELH5oEHgoCakkzhubo3ckKDkiRhNNuix",  # Whale 2
    "U2ML8tmmPWH9gqpCYmi3E44p5ZVYbM53ZWdQepAQ5Btt",  # Whale 3
    "HFr8SGrjsX5kn6wYW3qyPj8sgghTm29REwxLT8HEmaFo",  # Whale 4
    "qQpkeC6MShAJ6hkT9CsbaN9AWSrFhq9UifpTHtkzZfg3",  # Whale 5
    "AnH8NhrYYaa3ByUrw4K7Q9t4mcqUMZmKWpVbCadsevU5",  # Whale 6
    "Vew35TTn9g1HNNAuuNv4PVUpmMiWUtKXe4bYHY6Ad1yE",  # Whale 7
    "WtLJ3ZXj6pk4eKGAeeLtMfiMyGPiYaQ9wcjwLUQ5ivGW",  # Whale 8
    "fzEyUVur1EXQeAriJbyLEJq58ThxBAdcksHtVFbbHefq",  # Whale 9
    "nct32m69sUd6sLQrUe4hSRovgfq3RTnKVscsmEZUgmhP",  # Whale 10
    "Ymbg7vztDhJ8oNwH6R8obui58EUnEJQJPff6DpmoThWQ",  # Whale 11
    "yEWk94jRFpnRwUacA3EoQcRwdEf6b21PyhaTQeubLerp",  # Whale 12
    "x8yYpRSWwJGfpnmRmWxVMx4mozeHpDKaBqwQCFxdRPHT",  # Whale 13
    "NiV6cWc3EBx8wxf4YP9RV9VUYWwhdBcYYvnvoP6Fb3fL",  # Whale 14
    "23NAqrm5RSxS2k83fUbVDcB1faFkdMto6npLPhpxhLC9",  # Whale 15
    "gDZJEZ6TDKWQNgMegWZ2V2rjQ136pQCDekj69jYMdiUV",  # Whale 16
    "qZW5rsJ9osA3GLvfRX4Z3BZPHZF37ffQMwAdjzzyexin",  # Whale 17
    "bRgEN3ZKTZ5dXHpzoj5tjzMVpbDnoUCSADNCHEcFsmrX",  # Whale 18
    "ks6hP6ndZ9528SkuUTcFR2gqNYDRNUjaFF4JxpU3wXtB",  # Whale 19
    "S34jXLeoPrQoWHgRWG4HPk75BR38RezLu2MpaoCqptfd",  # Whale 20
    "rXHFWYnPud24b7s1VLDWRjm8gb3558JPHoe4HQ3ZZH1R",  # Whale 21
    "JpqZ11XEfAXjHyCyUN29cyi3zvmyjWVgb5GJzjhXaaZ7",  # Whale 22
    "45rhiYeZBkRPUfRBcmdkhKFfaP5KvizwaEWbgRUs4qMY",  # Whale 23
    "R7h7depA1sm7qMhEYPfEx9m9X2JE1mKi21isYxmnEPLb",  # Whale 24
    "QVUw7xQB3D2gJ2sapri55WrBRyj8twBp2k9hTxAZKgXH",  # Whale 25
    "f2Myvd3q1HYpe3DxJezrWWqLpeme7iKShoDijjsVF3ho",  # Whale 26
    "9AcryR19yChoeiWdhtKGGQkjVf7PVybZK5kcdPrNPkik",  # Whale 27
    "geJbZRd2wGvk2L5RwFVoWB9LpJApnWrMLeVziFgRqQA7",  # Whale 28
    "dvekcE4svBu9G5kKFTq2ksd6rc1k2U2XmeiCeZiUeLiS",  # Whale 29
    "gWrqEtsYKgRST6mwnc9t7xWxumEuN2TeUcpdeLwEZkR5",  # Whale 30
]

def send_telegram_alert(message: str):
    """Send alert to Telegram"""
    try:
        url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
        payload = {
            "chat_id": TELEGRAM_CHAT_ID,
            "text": message,
            "parse_mode": "HTML"
        }
        resp = requests.post(url, json=payload, timeout=10)
        return resp.status_code == 200
    except Exception as e:
        print(f"❌ Telegram error: {e}")
        return False

def check_wallet_transactions(wallet: str):
    """Check recent transactions for a wallet"""
    try:
        url = f"{CIELO_BASE_URL}/wallet/transactions"
        params = {
            "wallet": wallet,
            "chain": "solana",
            "limit": 10
        }
        headers = {
            "Authorization": f"Bearer {CIELO_API_KEY}"
        }
        
        resp = requests.get(url, params=params, headers=headers, timeout=30)
        
        if resp.status_code == 200:
            data = resp.json()
            transactions = data.get('data', [])
            
            if transactions:
                # Check for large transactions
                for tx in transactions[:5]:  # Only check most recent 5
                    value_usd = tx.get('value_usd', 0)
                    if value_usd > 1000:  # $1k threshold
                        token = tx.get('token_symbol', 'Unknown')
                        amount = tx.get('amount', 0)
                        tx_type = tx.get('type', 'transfer')
                        
                        alert_msg = f"""
🚨 WHALE ALERT 🚨

Wallet: {wallet[:10]}...{wallet[-6:]}
Action: {tx_type.upper()}
Token: {token}
Amount: ${value_usd:,.2f}
Details: {amount:,.2f} {token}

Time: {datetime.now().strftime('%H:%M:%S')}
                        """
                        
                        print(f"⚠️  Large transaction detected: ${value_usd:,.2f}")
                        send_telegram_alert(alert_msg)
            
            return len(transactions)
        else:
            print(f"❌ Cielo API error for {wallet[:10]}...: {resp.status_code}")
            return 0
    except Exception as e:
        print(f"❌ Error checking {wallet[:10]}...: {e}")
        return 0

def main():
    """Main tracking loop"""
    print("="*60)
    print("🦈 CIELO WHALE TRACKER")
    print(f"Tracking {len(WHALE_WALLETS)} whale wallets")
    print("="*60)
    
    iteration = 0
    while True:
        iteration += 1
        print(f"
📊 Iteration {iteration} - {datetime.now().strftime('%H:%M:%S')}")
        
        total_transactions = 0
        for i, wallet in enumerate(WHALE_WALLETS, 1):
            print(f"  Checking wallet {i}/{len(WHALE_WALLETS)}...")
            tx_count = check_wallet_transactions(wallet)
            total_transactions += tx_count
            
            # Be nice to the API
            time.sleep(0.5)
        
        print(f"✅ Checked {len(WHALE_WALLETS)} wallets, found {total_transactions} recent transactions")
        print(f"⏰ Next check in 5 minutes...")
        time.sleep(300)  # 5 minutes

if __name__ == "__main__":
    main()
