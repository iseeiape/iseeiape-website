import Head from 'next/head';
import { useState, useEffect } from 'react';

type AnalyticsEvent = {
  timestamp: string;
  eventType: 'page_view' | 'token_click' | 'wallet_click' | 'dashboard_refresh';
  page: string;
  data?: any;
};

type AnalyticsStats = {
  totalEvents: number;
  events24h: number;
  byEventType: Record<string, number>;
  byPage: Record<string, number>;
  uniquePages: number;
  timeline: Array<{ date: string; count: number }>;
};

export default function Analytics() {
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [recentEvents, setRecentEvents] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('24h');

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics/track?period=${timeRange}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data.summary);
        setRecentEvents(data.data.recentEvents);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, [timeRange]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const formatEventType = (eventType: string) => {
    const labels: Record<string, string> = {
      'page_view': '📄 Page View',
      'token_click': '💰 Token Click',
      'wallet_click': '🐋 Wallet Click',
      'dashboard_refresh': '🔄 Dashboard Refresh'
    };
    return labels[eventType] || eventType;
  };

  const formatPageName = (page: string) => {
    const pages: Record<string, string> = {
      '/': 'Home',
      '/dashboard': 'Dashboard',
      '/case-studies': 'Case Studies',
      '/guides': 'Guides',
      '/insights': 'Insights'
    };
    return pages[page] || page;
  };

  return (
    <>
      <Head>
        <title>Analytics Dashboard - iseeiape</title>
        <meta name="description" content="Website analytics and performance tracking" />
      </Head>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 20px', color: '#fff', background: '#0a0a0a', minHeight: '100vh' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '36px', color: '#00ff88', marginBottom: '10px' }}>📈 Analytics Dashboard</h1>
            <p style={{ color: '#888' }}>
              Track website performance and user engagement
            </p>
          </div>
          <div>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={{
                padding: '10px 20px',
                background: '#111',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '8px',
                marginRight: '10px'
              }}
            >
              <option value="24h">Last 24 Hours</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
            </select>
            <button
              onClick={fetchAnalytics}
              style={{
                padding: '10px 20px',
                background: '#00ff88',
                color: '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🔄 Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ fontSize: '24px', color: '#00ff88' }}>Loading analytics data...</div>
          </div>
        ) : stats && (
          <>
            {/* Stats Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '40px' }}>
              <div style={{ background: '#111', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>Total Events</div>
                <div style={{ fontSize: '48px', color: '#00ff88' }}>{stats.totalEvents}</div>
              </div>
              <div style={{ background: '#111', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>Events (24h)</div>
                <div style={{ fontSize: '48px', color: '#00ff88' }}>{stats.events24h}</div>
              </div>
              <div style={{ background: '#111', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>Unique Pages</div>
                <div style={{ fontSize: '48px', color: '#00ff88' }}>{stats.uniquePages}</div>
              </div>
              <div style={{ background: '#111', padding: '30px', borderRadius: '12px', textAlign: 'center' }}>
                <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>Most Active Page</div>
                <div style={{ fontSize: '24px', color: '#00ff88', marginTop: '10px' }}>
                  {Object.entries(stats.byPage).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A'}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '40px' }}>
              {/* Event Type Distribution */}
              <div style={{ background: '#111', padding: '30px', borderRadius: '12px' }}>
                <h2 style={{ fontSize: '24px', color: '#00ff88', marginBottom: '20px' }}>📊 Event Type Distribution</h2>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {Object.entries(stats.byEventType)
                    .sort((a, b) => b[1] - a[1])
                    .map(([eventType, count]) => (
                      <div key={eventType} style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span>{formatEventType(eventType)}</span>
                          <span style={{ color: '#00ff88' }}>{count}</span>
                        </div>
                        <div style={{ height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              background: '#00ff88',
                              width: `${(count / stats.totalEvents) * 100}%`,
                              borderRadius: '4px'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Page Performance */}
              <div style={{ background: '#111', padding: '30px', borderRadius: '12px' }}>
                <h2 style={{ fontSize: '24px', color: '#00ff88', marginBottom: '20px' }}>🌐 Page Performance</h2>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {Object.entries(stats.byPage)
                    .sort((a, b) => b[1] - a[1])
                    .map(([page, count]) => (
                      <div key={page} style={{ marginBottom: '15px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                          <span>{formatPageName(page)}</span>
                          <span style={{ color: '#00ff88' }}>{count}</span>
                        </div>
                        <div style={{ height: '8px', background: '#333', borderRadius: '4px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              height: '100%', 
                              background: '#0052FF',
                              width: `${(count / stats.totalEvents) * 100}%`,
                              borderRadius: '4px'
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Timeline Chart */}
            <div style={{ background: '#111', padding: '30px', borderRadius: '12px', marginBottom: '40px' }}>
              <h2 style={{ fontSize: '24px', color: '#00ff88', marginBottom: '20px' }}>📅 Activity Timeline (Last 7 Days)</h2>
              <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '10px' }}>
                {stats.timeline.map((day, index) => {
                  const maxCount = Math.max(...stats.timeline.map(d => d.count));
                  const height = maxCount > 0 ? (day.count / maxCount) * 150 : 0;
                  
                  return (
                    <div key={index} style={{ flex: 1, textAlign: 'center' }}>
                      <div style={{ 
                        height: `${height}px`, 
                        background: day.count > 0 ? '#00ff88' : '#333',
                        borderRadius: '4px 4px 0 0',
                        marginBottom: '10px'
                      }} />
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </div>
                      <div style={{ fontSize: '14px', color: '#fff' }}>{day.count}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Events */}
            <div style={{ background: '#111', padding: '30px', borderRadius: '12px' }}>
              <h2 style={{ fontSize: '24px', color: '#00ff88', marginBottom: '20px' }}>🕒 Recent Events</h2>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #333' }}>
                      <th style={{ textAlign: 'left', padding: '10px', color: '#888' }}>Time</th>
                      <th style={{ textAlign: 'left', padding: '10px', color: '#888' }}>Event Type</th>
                      <th style={{ textAlign: 'left', padding: '10px', color: '#888' }}>Page</th>
                      <th style={{ textAlign: 'left', padding: '10px', color: '#888' }}>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentEvents.map((event, index) => (
                      <tr key={index} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '10px', fontSize: '12px', color: '#888' }}>
                          {formatDate(event.timestamp)}
                        </td>
                        <td style={{ padding: '10px' }}>
                          <span style={{
                            padding: '4px 8px',
                            background: '#1a1a1a',
                            borderRadius: '4px',
                            fontSize: '12px'
                          }}>
                            {formatEventType(event.eventType)}
                          </span>
                        </td>
                        <td style={{ padding: '10px' }}>{formatPageName(event.page)}</td>
                        <td style={{ padding: '10px', fontSize: '12px', color: '#888' }}>
                          {event.data ? JSON.stringify(event.data) : '—'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <a href="/" style={{ 
            padding: '10px 20px', 
            background: '#00ff88', 
            color: '#000', 
            textDecoration: 'none', 
            borderRadius: '8px',
            marginRight: '10px'
          }}>
            ← Back to Home
          </a>
          <a href="/dashboard" style={{ 
            padding: '10px 20px', 
            background: '#0052FF', 
            color: '#fff', 
            textDecoration: 'none', 
            borderRadius: '8px'
          }}>
            📊 Go to Live Dashboard
          </a>
        </div>

        <div style={{ marginTop: '40px', padding: '20px', background: '#111', borderRadius: '8px', fontSize: '12px', color: '#888' }}>
          <p><strong>Note:</strong> Analytics data is stored locally and anonymized. No personal data is collected.</p>
          <p><strong>Tracking:</strong> Page views, token clicks, wallet clicks, dashboard refreshes</p>
          <p><strong>Auto-refresh:</strong> Every 30 seconds • Data retention: Last 10,000 events</p>
        </div>
      </div>
    </>
  );
}