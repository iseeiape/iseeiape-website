#!/usr/bin/env python3
"""
🦈 WHALE WALLET FINDER
Automatically find real whale wallets from trending Solana tokens
For use with Cielo API tracking system
"""

import requests
import json
import time
from datetime import datetime
import os
from typing import List, Dict, Optional

# Configuration
BIRDEYE_API_KEY = os.environ.get("BIRDEYE_API_KEY", "YOUR_API_KEY_HERE")
BIRDEYE_BASE_URL = "https://public-api.birdeye.so"

# DexScreener for trending tokens
DEXSCREENER_BASE_URL = "https://api.dexscreener.com"

def get_trending_tokens(limit: int = 10) -> List[Dict]:
    """Get trending tokens from DexScreener"""
    try:
        url = f"{DEXSCREENER_BASE_URL}/latest/dex/tokens/trending"
        print(f"🔍 Fetching {limit} trending tokens...")
        
        resp = requests.get(url, timeout=30)
        if resp.status_code == 200:
            data = resp.json()
            tokens = data.get('tokens', [])[:limit]
            
            print(f"✅ Found {len(tokens)} trending tokens")
            for i, token in enumerate(tokens, 1):
                name = token.get('name', 'Unknown')
                symbol = token.get('symbol', '?')
                price = token.get('priceUsd', 0)
                volume = token.get('volume', {}).get('h24', 0)
                print(f"{i:2}. {symbol:8} {name[:20]:20} ${price:8.4f} | 24h Vol: ${volume:,.0f}")
            
            return tokens
        else:
            print(f"❌ DexScreener error: {resp.status_code}")
            return []
    except Exception as e:
        print(f"❌ Error fetching trending tokens: {e}")
        return []

def get_token_holders(token_address: str, limit: int = 50) -> List[Dict]:
    """Get top token holders from Birdeye"""
    try:
        if BIRDEYE_API_KEY == "YOUR_API_KEY_HERE":
            print("⚠️  Please set BIRDEYE_API_KEY environment variable")
            return []
            
        url = f"{BIRDEYE_BASE_URL}/public/token_holder"
        params = {
            'address': token_address,
            'offset': 0,
            'limit': limit
        }
        headers = {
            'X-API-KEY': BIRDEYE_API_KEY
        }
        
        print(f"🔍 Fetching holders for {token_address[:20]}...")
        resp = requests.get(url, params=params, headers=headers, timeout=30)
        
        if resp.status_code == 200:
            data = resp.json()
            holders = data.get('data', {}).get('items', [])
            
            if holders:
                print(f"✅ Found {len(holders)} holders")
                # Filter for whales (top 10% of holders by percentage)
                whales = []
                for h in holders[:10]:  # Top 10 holders are usually whales
                    pct = h.get('percentage', 0)
                    if pct > 1.0:  # More than 1% of supply
                        whales.append(h)
                
                print(f"🦈 Identified {len(whales)} whale wallets (>1% supply)")
                return whales
            else:
                print("⚠️  No holder data returned")
                return []
        else:
            print(f"❌ Birdeye error: {resp.status_code}")
            return []
    except Exception as e:
        print(f"❌ Error fetching holders: {e}")
        return []

def export_wallets_for_cielo(wallets: List[str], filename: str = "whale_wallets.txt"):
    """Export wallet addresses for Cielo tracking"""
    if not wallets:
        print("⚠️  No wallets to export")
        return
    
    with open(filename, 'w') as f:
        for wallet in wallets:
            f.write(f"{wallet}\n")
    
    print(f"✅ Exported {len(wallets)} wallets to {filename}")
    print(f"📋 First 5 wallets:")
    for i, wallet in enumerate(wallets[:5], 1):
        print(f"   {i}. {wallet}")

def main():
    """Main execution flow"""
    print("="*60)
    print("🦈 WHALE WALLET FINDER v1.0")
    print("="*60)
    
    # Step 1: Get trending tokens
    trending_tokens = get_trending_tokens(limit=5)
    
    if not trending_tokens:
        print("❌ Could not fetch trending tokens. Using fallback...")
        # Use some known trending tokens as fallback
        trending_tokens = [
            {"address": "So11111111111111111111111111111111111111112", "symbol": "SOL", "name": "Solana"},
            {"address": "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v", "symbol": "USDC", "name": "USD Coin"},
        ]
    
    # Step 2: Get whale wallets from each token
    all_whale_wallets = []
    
    for token in trending_tokens:
        token_address = token.get('address')
        symbol = token.get('symbol', 'Unknown')
        
        if token_address:
            print(f"\n📊 Analyzing {symbol}...")
            whales = get_token_holders(token_address, limit=20)
            
            for whale in whales:
                wallet_address = whale.get('owner')
                if wallet_address and wallet_address not in all_whale_wallets:
                    all_whale_wallets.append(wallet_address)
            
            # Be respectful to APIs
            time.sleep(1)
    
    # Step 3: Export wallets
    if all_whale_wallets:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M")
        filename = f"whale_wallets_{timestamp}.txt"
        export_wallets_for_cielo(all_whale_wallets, filename)
        
        print(f"\n🎯 Total unique whale wallets found: {len(all_whale_wallets)}")
        print(f"📁 Saved to: {filename}")
        
        # Also create a JSON version with metadata
        json_filename = f"whale_wallets_{timestamp}.json"
        with open(json_filename, 'w') as f:
            json.dump({
                "generated_at": datetime.now().isoformat(),
                "total_wallets": len(all_whale_wallets),
                "wallets": all_whale_wallets,
                "source_tokens": [t.get('symbol') for t in trending_tokens]
            }, f, indent=2)
        
        print(f"📊 JSON metadata saved to: {json_filename}")
    else:
        print("\n❌ No whale wallets found. Check API keys and connectivity.")
    
    print("\n" + "="*60)
    print("✅ Whale Wallet Finder completed")
    print("="*60)

if __name__ == "__main__":
    main()