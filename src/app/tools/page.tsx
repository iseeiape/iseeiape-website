// Free Tools page - Wallet Lookup Tool with REAL Helius API
"use client";

import { useState } from 'react';
import Link from 'next/link';

interface WalletData {
  address: string;
  solBalance: number;
  transactions: any[];
  tokens: TokenData[];
  isLoading: boolean;
  error?: string;
}

interface TokenData {
  mint: string;
  amount: number;
  symbol: string;
  name: string;
  decimals: number;
  usdValue?: number;
}

const HELIUS_API_KEY = 'ef87b1e5-3d25-4ef2-a03b-27fe43c2d0e7';

export default function ToolsPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress.trim()) return;

    setLoading(true);
    setError(null);
    setWalletData(null);

    // Validate Solana address
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(walletAddress)) {
      setError('Invalid Solana address format');
      setLoading(false);
      return;
    }

    try {
      // Fetch balance
      const balanceRes = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getBalance',
          params: [walletAddress]
        })
      });
      const balanceData = await balanceRes.json();
      const solBalance = (balanceData.result?.value || 0) / 1e9;

      // Fetch token accounts
      const tokenRes = await fetch(`https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: 1,
          method: 'getTokenAccountsByOwner',
          params: [
            walletAddress,
            { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
            { encoding: 'jsonParsed' }
          ]
        })
      });
      const tokenData = await tokenRes.json();

      // Fetch recent transactions
      const txRes = await fetch(`https://api-mainnet.helius-rpc.com/v0/addresses/${walletAddress}/transactions/?api-key=${HELIUS_API_KEY}&limit=10`);
      const txData = await txRes.json();

      // Parse tokens
      const tokens: TokenData[] = (tokenData.result?.value || [])
        .map((acc: any) => ({
          mint: acc.account.data.parsed.info.mint,
          amount: parseFloat(acc.account.data.parsed.info.tokenAmount.amount) / Math.pow(10, acc.account.data.parsed.info.tokenAmount.decimals),
          symbol: acc.account.data.parsed.info.tokenAmount.decimals === 0 ? 'NFT' : 'TOKEN',
          name: 'Unknown',
          decimals: acc.account.data.parsed.info.tokenAmount.decimals
        }))
        .filter((t: TokenData) => t.amount > 0)
        .slice(0, 10);

      setWalletData({
        address: walletAddress,
        solBalance,
        transactions: txData || [],
        tokens,
        isLoading: false
      });

    } catch (err: any) {
      setError('Failed to fetch wallet data. The wallet may not exist or the RPC is rate limited.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (addr: string) => {
    if (!addr || addr.length < 12) return addr;
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Navigation */}
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-xl font-bold hover:text-orange-400 transition-colors">
              🦞 iseeiape
            </Link>
            <Link 
              href="/"
              className="text-gray-400 hover:text-white transition-colors text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-400 via-red-500 to-purple-500 bg-clip-text text-transparent">
            🛠️ Free Tools
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Analyze any Solana wallet with real on-chain data.
          </p>
        </div>

        {/* Wallet Lookup Tool */}
        <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 mb-12">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🔍</span>
            <div>
              <h2 className="text-2xl font-bold">Wallet Analyzer</h2>
              <p className="text-gray-400">Check any Solana wallet's real activity</p>
            </div>
          </div>

          <form onSubmit={handleLookup} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Solana Wallet Address
              </label>
              <input
                type="text"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="e.g., 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-600 focus:border-orange-500 focus:outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !walletAddress.trim()}
              className="w-full px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Fetching On-Chain Data...' : 'Analyze Wallet'}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              {error}
            </div>
          )}

          {/* Results */}
          {walletData && (
            <div className="mt-6 pt-6 border-t border-gray-700/50 animate-fade-in">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-gray-400 text-sm">Wallet Address</p>
                  <p className="font-mono text-lg">{formatAddress(walletData.address)}</p>
                </div>
                <div className="flex gap-2">
                  <a
                    href={`https://solscan.io/account/${walletData.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors"
                  >
                    Solscan →
                  </a>
                  <a
                    href={`https://app.cielo.finance/profile/${walletData.address}?ref_code=iseeiape`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-orange-500/20 text-orange-400 hover:bg-orange-500/30 rounded-lg text-sm font-medium transition-colors"
                  >
                    Cielo →
                  </a>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-orange-400">{walletData.solBalance.toFixed(3)}</p>
                  <p className="text-gray-500 text-sm">SOL Balance</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-blue-400">{walletData.tokens.length}</p>
                  <p className="text-gray-500 text-sm">Token Accounts</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-purple-400">{walletData.transactions.length}</p>
                  <p className="text-gray-500 text-sm">Recent TXs</p>
                </div>
                <div className="bg-gray-900/50 p-4 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-400">${(walletData.solBalance * 100).toFixed(0)}</p>
                  <p className="text-gray-500 text-sm">SOL Value (~$100/SOL)</p>
                </div>
              </div>

              {/* Recent Transactions */}
              {walletData.transactions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3">Recent Transactions</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {walletData.transactions.slice(0, 10).map((tx: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg text-sm">
                        <div className="flex items-center gap-3">
                          <span className={`text-lg ${tx.type === 'TRANSFER' ? 'text-blue-400' : 'text-gray-400'}`}>
                            {tx.type === 'TRANSFER' ? '↔' : '•'}
                          </span>
                          <div>
                            <p className="font-medium">{tx.type || 'Transaction'}</p>
                            <p className="text-xs text-gray-500">{tx.signature ? formatAddress(tx.signature) : 'Unknown'}</p>
                          </div>
                        </div>
                        <p className="text-gray-400 text-xs">
                          {tx.timestamp ? formatTimeAgo(tx.timestamp) : 'Recently'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Token Holdings */}
              {walletData.tokens.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold mb-3">Token Holdings</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {walletData.tokens.map((token: TokenData, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="text-gray-500 text-sm">#{idx + 1}</span>
                          <div>
                            <p className="font-medium font-mono text-sm">{formatAddress(token.mint)}</p>
                            <p className="text-xs text-gray-500">{token.symbol}</p>
                          </div>
                        </div>
                        <p className="font-mono text-sm">{token.amount.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4 p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <p className="text-sm text-orange-400">
                  💡 <strong>Want to track this wallet?</strong> Get real-time alerts when they trade with Cielo.
                </p>
                <a
                  href={`https://app.cielo.finance/profile/${walletData.address}?ref_code=iseeiape`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 text-orange-400 hover:text-orange-300 font-medium"
                >
                  Track on Cielo →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* More Tools */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 opacity-60">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold mb-2">Top Wallets This Week</h3>
            <p className="text-gray-400 text-sm">Coming soon</p>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 opacity-60">
            <div className="text-3xl mb-3">🎯</div>
            <h3 className="font-bold mb-2">Token Sentiment Checker</h3>
            <p className="text-gray-400 text-sm">Coming soon</p>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 opacity-60">
            <div className="text-3xl mb-3">🔔</div>
            <h3 className="font-bold mb-2">Price Alert Bot</h3>
            <p className="text-gray-400 text-sm">Coming soon</p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Want more advanced tools and real-time alerts?
          </p>
          <a
            href="https://app.cielo.finance?ref_code=iseeiape"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-red-500 rounded-full font-bold hover:scale-105 transition-transform shadow-lg"
          >
            🔓 Unlock Full Analytics
          </a>
        </div>
      </div>
    </div>
  );
}
