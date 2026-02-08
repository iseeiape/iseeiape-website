"use client";

import { useEffect, useState } from 'react';

interface AnalyticsSummary {
  success: boolean;
  period: string;
  totals: {
    totalClicks: number;
    tokenClicks: number;
    walletClicks: number;
    generalClicks: number;
    days: number;
  };
  topSources: Array<{ source: string; count: number }>;
  topTargets: Array<{ target: string; count: number }>;
  dailyStats: Record<string, any>;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);

  useEffect(() => {
    fetchAnalytics();
  }, [days]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/track?days=${days}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return num.toLocaleString('en-US');
  };

  const getClickTypeColor = (type: string) => {
    switch (type) {
      case 'token_click': return 'bg-green-500/20 text-green-400';
      case 'wallet_click': return 'bg-blue-500/20 text-blue-400';
      case 'general_click': return 'bg-purple-500/20 text-purple-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (!analytics?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">📊 Analytics Dashboard</h1>
          <p className="text-gray-400 mb-6">No analytics data available yet.</p>
          <p className="text-sm text-gray-500">
            Analytics will appear after users start clicking on tokens and wallets.
          </p>
        </div>
      </div>
    );
  }

  const { totals, topSources, topTargets, dailyStats } = analytics;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <nav className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between">
          <a href="/" className="text-xl font-bold">🦞 iseeiape</a>
          <a href="/" className="text-gray-400 hover:text-white">← Back to Home</a>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
            📊 Analytics Dashboard
          </h1>
          <p className="text-gray-400">Track ref link performance and user engagement</p>
          
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setDays(1)}
              className={`px-4 py-2 rounded-full text-sm ${days === 1 ? 'bg-orange-500' : 'bg-gray-800'}`}
            >
              24 Hours
            </button>
            <button
              onClick={() => setDays(7)}
              className={`px-4 py-2 rounded-full text-sm ${days === 7 ? 'bg-orange-500' : 'bg-gray-800'}`}
            >
              7 Days
            </button>
            <button
              onClick={() => setDays(30)}
              className={`px-4 py-2 rounded-full text-sm ${days === 30 ? 'bg-orange-500' : 'bg-gray-800'}`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-lg font-bold mb-2">Total Clicks</h3>
            <p className="text-3xl font-bold">{formatNumber(totals.totalClicks)}</p>
            <p className="text-sm text-gray-400 mt-2">Over {totals.days} days</p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-lg font-bold mb-2">Token Clicks</h3>
            <p className="text-3xl font-bold text-green-400">{formatNumber(totals.tokenClicks)}</p>
            <p className="text-sm text-gray-400 mt-2">
              {totals.totalClicks > 0 ? Math.round((totals.tokenClicks / totals.totalClicks) * 100) : 0}% of total
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-lg font-bold mb-2">Wallet Clicks</h3>
            <p className="text-3xl font-bold text-blue-400">{formatNumber(totals.walletClicks)}</p>
            <p className="text-sm text-gray-400 mt-2">
              {totals.totalClicks > 0 ? Math.round((totals.walletClicks / totals.totalClicks) * 100) : 0}% of total
            </p>
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-lg font-bold mb-2">Avg Daily</h3>
            <p className="text-3xl font-bold text-purple-400">
              {totals.days > 0 ? formatNumber(Math.round(totals.totalClicks / totals.days)) : 0}
            </p>
            <p className="text-sm text-gray-400 mt-2">Clicks per day</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Sources */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-xl font-bold mb-4">🔥 Top Sources</h3>
            <p className="text-gray-400 mb-4">Where clicks are coming from</p>
            
            <div className="space-y-3">
              {topSources.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-bold">#{index + 1}</span>
                    <div>
                      <p className="font-medium">{item.source.split(':')[0]}</p>
                      <p className="text-xs text-gray-500">{item.source.split(':').slice(1).join(':')}</p>
                    </div>
                  </div>
                  <span className="font-bold">{formatNumber(item.count)} clicks</span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Targets */}
          <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
            <h3 className="text-xl font-bold mb-4">🎯 Top Targets</h3>
            <p className="text-gray-400 mb-4">Most clicked tokens & wallets</p>
            
            <div className="space-y-3">
              {topTargets.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-gray-500 font-bold">#{index + 1}</span>
                    <div>
                      <p className="font-mono text-sm">{item.target.slice(0, 6)}...{item.target.slice(-4)}</p>
                      <p className="text-xs text-gray-500">
                        {item.target.length > 44 ? 'Token' : 'Wallet'}
                      </p>
                    </div>
                  </div>
                  <span className="font-bold">{formatNumber(item.count)} clicks</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Daily Breakdown */}
        <div className="mt-8 bg-gray-800/50 p-6 rounded-xl border border-gray-700/50">
          <h3 className="text-xl font-bold mb-4">📅 Daily Breakdown</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Total</th>
                  <th className="text-left py-3 px-4">Tokens</th>
                  <th className="text-left py-3 px-4">Wallets</th>
                  <th className="text-left py-3 px-4">Top Source</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(dailyStats)
                  .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                  .map(([date, stats]: [string, any]) => {
                    const topSource = Object.entries(stats.sources || {})
                      .sort(([, a], [, b]) => (b as number) - (a as number))[0];
                    
                    return (
                      <tr key={date} className="border-b border-gray-800/50 hover:bg-gray-700/30">
                        <td className="py-3 px-4">{date}</td>
                        <td className="py-3 px-4 font-bold">{stats.totalClicks || 0}</td>
                        <td className="py-3 px-4">
                          <span className="text-green-400">{stats.tokenClicks || 0}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-blue-400">{stats.walletClicks || 0}</span>
                        </td>
                        <td className="py-3 px-4">
                          {topSource ? (
                            <div>
                              <p className="text-sm">{topSource[0].split(':')[0]}</p>
                              <p className="text-xs text-gray-500">{topSource[1]} clicks</p>
                            </div>
                          ) : (
                            <span className="text-gray-500">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-8 p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <h4 className="text-lg font-bold mb-2 text-yellow-400">💡 How This Works</h4>
          <ul className="text-gray-300 space-y-2">
            <li>• Every click on a token or wallet is tracked anonymously</li>
            <li>• Data helps optimize which content drives the most engagement</li>
            <li>• Ref link performance can be measured by correlating with Cielo dashboard</li>
            <li>• All data is stored locally (no third-party analytics)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}