"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
  marketCap: number;
  ca: string;
  rank?: number;
}

interface FeedItem {
  id: string;
  wallet: string;
  wallet_label?: string;
  tx_type: string;
  token_in_symbol?: string;
  token_in_address?: string;
  amount_usd: number;
  timestamp: number;
}

type TabType = 'dexscreener' | 'smart-feed' | 'soylana-traders' | 'dev-do-something' | 'insidoors';

const tabs = [
  { id: 'dexscreener', label: '🔥 Trending', emoji: '📊', desc: 'Top tokens by volume' },
  { id: 'smart-feed', label: '⚡ Live Feed', emoji: '⚡', desc: 'Real-time smart money' },
  { id: 'soylana-traders', label: '🌱 SOYLANA', emoji: '🌱', desc: 'Live activity' },
  { id: 'dev-do-something', label: '🔧 Dev Activity', emoji: '🔧', desc: 'Live dev moves' },
  { id: 'insidoors', label: '🕵️ Insidoors', emoji: '🕵️', desc: 'Live insider trades' },
];

export default function TrendingPage() {
  const [activeTab, setActiveTab] = useState<TabType>('dexscreener');
  const [data, setData] = useState<any>(null);
  const [dataType, setDataType] = useState<'tokens' | 'feed'>('tokens');
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, activeTab === 'smart-feed' ? 30 * 1000 : 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/trending?tab=${activeTab}`);
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        setDataType(result.type);
        setSource(result.source);
        setNote(result.note || '');
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number, compact = false) => {
    if (compact) {
      if (num >= 1e9) return `$${(num / 1e9).toFixed(1)}B`;
      if (num >= 1e6) return `$${(num / 1e6).toFixed(1)}M`;
      if (num >= 1e3) return `$${(num / 1e3).toFixed(1)}K`;
      return `$${num.toFixed(3)}`;
    }
    return num.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor(Date.now() / 1000 - timestamp);
    if (seconds < 60) return 'Just now';
    const mins = Math.floor(seconds / 60);
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ago`;
  };

  const currentTab = tabs.find(t => t.id === activeTab);
  const isLive = source === 'dexscreener' || source === 'cielo-feed';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <Link href="/" className="text-xl font-bold">🦞 iseeiape</Link>
          <Link href="/" className="text-gray-400 hover:text-white">← Back</Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
            🔥 Trending
          </h1>
          <p className="text-gray-400">{currentTab?.desc}</p>
          {note && <p className="text-yellow-400 text-sm mt-1">{note}</p>}
          {source && (
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs ${
              isLive ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
            }`}>
              {isLive ? '🟢 Live' : '🟡 Demo'}
            </span>
          )}
        </div>

        <div className="flex flex-wrap justify-center gap-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabType)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.emoji} {tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Loading...</p>
          </div>
        )}

        {/* Tokens View */}
        {!loading && dataType === 'tokens' && (
          <div className="grid gap-3">
            {(data as Token[])?.map((token, i) => (
              <div key={token.id}
                onClick={() => window.open(`https://app.cielo.finance/trading/${token.ca}?ref_code=iseeiape`, '_blank')}
                className="bg-gray-800/50 hover:bg-gray-700/70 p-4 rounded-xl cursor-pointer border border-gray-700/50 hover:border-orange-500/50 transition-all">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-gray-600 w-10">#{token.rank || i + 1}</span>
                    <div>
                      <h3 className="text-lg font-bold">{token.name} <span className="text-gray-500">{token.symbol}</span></h3>
                      <p className="text-xs text-gray-500 font-mono">{token.ca.slice(0, 6)}...{token.ca.slice(-4)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xl font-mono font-bold">{formatNumber(token.price, true)}</p>
                      <p className={`text-sm font-bold ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {token.change24h >= 0 ? '+' : ''}{token.change24h.toFixed(1)}%
                      </p>
                    </div>
                    <div className="hidden md:block text-right">
                      <p className="text-sm font-mono">{formatNumber(token.volume24h, true)}</p>
                      <p className="text-xs text-gray-500">Vol</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Feed View */}
        {!loading && dataType === 'feed' && (
          <div className="grid gap-3">
            {(data as FeedItem[])?.map((item, i) => (
              <div key={item.id || i}
                onClick={() => item.token_in_address && window.open(`https://app.cielo.finance/trading/${item.token_in_address}?ref_code=iseeiape`, '_blank')}
                className="bg-gray-800/50 hover:bg-gray-700/70 p-4 rounded-xl cursor-pointer border border-gray-700/50 hover:border-orange-500/50 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl ${item.tx_type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                      {item.tx_type === 'buy' ? '↑' : '↓'}
                    </span>
                    <div>
                      <p className="font-medium">
                        <a 
                          href={`https://app.cielo.finance/profile/${item.wallet}?ref_code=iseeiape`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-orange-400 hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {item.wallet_label || item.wallet.slice(0, 6) + '...' + item.wallet.slice(-4)}
                        </a>
                        <span className={`ml-2 ${item.tx_type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                          {item.tx_type === 'buy' ? 'bought' : 'sold'}
                        </span>
                        <span className="ml-2 font-bold">{item.token_in_symbol || 'Token'}</span>
                      </p>
                      <p className="text-xs text-gray-500">{formatTimeAgo(item.timestamp)}</p>
                    </div>
                  </div>
                  <p className={`font-mono font-bold ${item.tx_type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                    ${item.amount_usd.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>{isLive ? '🟢 Live data' : '🟡 Demo data'} • Updates every {activeTab === 'smart-feed' ? '30s' : '2min'}</p>
          {source === 'cielo-feed' && (
            <p className="mt-1 text-orange-400">Showing real-time transactions from your tracked wallets</p>
          )}
        </div>
      </div>
    </div>
  );
}
