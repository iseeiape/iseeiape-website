// Live Smart Money Feed Component
// Shows recent whale activity on the homepage

"use client";

import { useEffect, useState } from 'react';

interface WhaleTrade {
  id: string;
  wallet: string;
  walletLabel?: string;
  tokenSymbol: string;
  tokenName: string;
  tokenAddress: string;
  type: 'buy' | 'sell';
  amountUSD: number;
  timestamp: number;
  chain: string;
}

export default function LiveFeed() {
  const [trades, setTrades] = useState<WhaleTrade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For now, use demo data. In production, fetch from Cielo API
    const demoTrades: WhaleTrade[] = [
      {
        id: '1',
        wallet: '0xabc...1234',
        walletLabel: '🐋 Whale #1',
        tokenSymbol: '$MOLT',
        tokenName: 'MOLT',
        tokenAddress: 'D83magNboiLuDafj9X8mrHe6eCpDJACuXBRYVuMypump',
        type: 'buy',
        amountUSD: 25000,
        timestamp: Date.now() - 1000 * 60 * 2, // 2 mins ago
        chain: 'solana'
      },
      {
        id: '2',
        wallet: '0xdef...5678',
        walletLabel: '🦈 Smart Money',
        tokenSymbol: '$AI16Z',
        tokenName: 'AI16Z',
        tokenAddress: 'HeLp6NuQkmYB4ZNQD22TTK9stPdjfs4Qs4iFzjbApump',
        type: 'buy',
        amountUSD: 15000,
        timestamp: Date.now() - 1000 * 60 * 5, // 5 mins ago
        chain: 'solana'
      },
      {
        id: '3',
        wallet: '0xghi...9012',
        walletLabel: '🦞 Early Bird',
        tokenSymbol: '$CLAWD',
        tokenName: 'Clawd',
        tokenAddress: '8JxBAAHj86wbQgUTjGuj6GTTL5Ps3cqxKRTvpaJApump',
        type: 'buy',
        amountUSD: 8500,
        timestamp: Date.now() - 1000 * 60 * 8, // 8 mins ago
        chain: 'solana'
      },
      {
        id: '4',
        wallet: '0xjkl...3456',
        walletLabel: '🐋 Whale #3',
        tokenSymbol: '$aiXBT',
        tokenName: 'aiXBT',
        tokenAddress: 'aiXBTTokenAddress45678901234567890123456789012',
        type: 'sell',
        amountUSD: 12000,
        timestamp: Date.now() - 1000 * 60 * 12, // 12 mins ago
        chain: 'solana'
      },
      {
        id: '5',
        wallet: '0xmno...7890',
        walletLabel: '🦈 Smart Money',
        tokenSymbol: '$VIRTUAL',
        tokenName: 'VIRTUAL',
        tokenAddress: 'VirtualTokenAddress789012345678901234567890123',
        type: 'buy',
        amountUSD: 18000,
        timestamp: Date.now() - 1000 * 60 * 15, // 15 mins ago
        chain: 'solana'
      }
    ];

    setTrades(demoTrades);
    setLoading(false);

    // In production, fetch real data:
    // fetch('/api/live-feed').then(...)
  }, []);

  const formatTime = (timestamp: number) => {
    const minutes = Math.floor((Date.now() - timestamp) / (1000 * 60));
    if (minutes < 1) return 'Just now';
    if (minutes === 1) return '1m ago';
    return `${minutes}m ago`;
  };

  const handleClick = (trade: WhaleTrade) => {
    window.open(`https://app.cielo.finance/trading/${trade.tokenAddress}?ref_code=iseeiape`, '_blank');
  };

  return (
    <div className="bg-gray-800/30 rounded-2xl p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          Live Smart Money Moves
        </h3>
        <span className="text-xs text-gray-500">Updates every 60s</span>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-400">Loading whale activity...</div>
      ) : (
        <div className="space-y-3">
          {trades.map((trade) => (
            <div
              key={trade.id}
              onClick={() => handleClick(trade)}
              className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg cursor-pointer hover:bg-gray-700/50 transition-colors border border-gray-700/50 hover:border-orange-500/30"
            >
              <div className="flex items-center gap-3">
                <span className={`text-lg ${trade.type === 'buy' ? '🟢' : '🔴'}`}>
                  {trade.type === 'buy' ? '↑' : '↓'}
                </span>
                <div>
                  <p className="font-medium">
                    <span className="text-gray-400">{trade.walletLabel}</span>
                    <span className={`ml-2 ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.type === 'buy' ? 'bought' : 'sold'}
                    </span>
                    <span className="ml-2 text-white font-bold">{trade.tokenSymbol}</span>
                  </p>
                  <p className="text-xs text-gray-500">{formatTime(trade.timestamp)}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-mono font-bold ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                  ${trade.amountUSD.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <a
          href="https://app.cielo.finance?ref_code=iseeiape"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-orange-400 hover:text-orange-300 flex items-center gap-1"
        >
          View all 1,000+ tracked wallets →
        </a>
      </div>
    </div>
  );
}
