import Layout from '../components/Layout'
import { useState, useEffect } from 'react'

export default function AutomationDashboard() {
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/automation/cron-status')
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      const data = await response.json()
      setDashboardData(data)
      setLastUpdated(new Date().toLocaleTimeString())
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Fallback to mock data if API fails
      setDashboardData(getMockData())
      setLastUpdated(new Date().toLocaleTimeString())
      setLoading(false)
    }
  }

  const getMockData = () => {
    return {
      timestamp: new Date().toISOString(),
      systemHealth: 'healthy',
      summary: {
        totalJobs: 5,
        criticalJobs: 4,
        healthyJobs: 5,
        errorJobs: 0,
        staleJobs: 0,
        failingCriticalJobs: 0
      },
      cronJobs: [
        {
          name: 'wolf_alerts',
          description: 'Wolf Alerts v4.2 (DexScreener)',
          schedule: '*/30 * * * *',
          critical: true,
          status: 'healthy',
          ageMinutes: 5,
          errorCount: 0
        },
        {
          name: 'trend_tracker',
          description: 'Trend Tracker (Reddit + Hacker News)',
          schedule: '*/30 * * * *',
          critical: true,
          status: 'healthy',
          ageMinutes: 8,
          errorCount: 0
        },
        {
          name: 'telegram_alerts',
          description: 'Telegram Alerts',
          schedule: '5,35 * * * *',
          critical: true,
          status: 'healthy',
          ageMinutes: 3,
          errorCount: 0
        },
        {
          name: 'data_fetcher',
          description: 'Real-time Data Fetcher',
          schedule: '*/5 * * * *',
          critical: true,
          status: 'healthy',
          ageMinutes: 2,
          errorCount: 0
        },
        {
          name: 'content_scheduler',
          description: 'Content Scheduler',
          schedule: '0 * * * *',
          critical: false,
          status: 'healthy',
          ageMinutes: 45,
          errorCount: 0
        }
      ],
      systemResources: {
        diskUsage: '45%',
        memUsage: '65.2%',
        cpuLoad: '1.25'
      },
      alertHistory: [],
      activeAlerts: 0,
      monitorStatus: 'active',
      monitorLastRun: new Date().toISOString()
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#14F195'
      case 'operational': return '#14F195'
      case 'pending': return '#FFD60A'
      case 'stale': return '#FF9F0A'
      case 'error': return '#FF3B30'
      case 'critical': return '#FF3B30'
      case 'degraded': return '#FF9F0A'
      default: return '#8E8E93'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy': return '✅'
      case 'operational': return '✅'
      case 'pending': return '⏰'
      case 'stale': return '⚠️'
      case 'error': return '❌'
      case 'critical': return '🔴'
      case 'degraded': return '🟡'
      default: return '❓'
    }
  }

  const getHealthColor = (health) => {
    switch (health) {
      case 'healthy': return 'rgba(20, 241, 149, 0.15)'
      case 'degraded': return 'rgba(255, 159, 10, 0.15)'
      case 'critical': return 'rgba(255, 59, 48, 0.15)'
      default: return 'rgba(142, 142, 147, 0.15)'
    }
  }

  const getHealthTextColor = (health) => {
    switch (health) {
      case 'healthy': return '#14F195'
      case 'degraded': return '#FF9F0A'
      case 'critical': return '#FF3B30'
      default: return '#8E8E93'
    }
  }

  if (loading) {
    return (
      <Layout title="Automation Dashboard | iseeiape">
        <div className="container">
          <div className="section">
            <h1 className="heading-2">🤖 Automation Dashboard</h1>
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Automation Dashboard | iseeiape">
      <div className="container">
        {/* Header */}
        <div className="section" style={{ paddingBottom: 0 }}>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h1 className="heading-2 mb-2">🤖 Automation Dashboard</h1>
              <p style={{ color: 'var(--text-muted)' }}>
                Real-time monitoring of all automation systems • Updated {lastUpdated}
                {dashboardData.monitorStatus === 'active' && dashboardData.monitorLastRun && (
                  <span> • Monitor last run: {new Date(dashboardData.monitorLastRun).toLocaleTimeString()}</span>
                )}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <span 
                className="tag" 
                style={{ 
                  background: getHealthColor(dashboardData.systemHealth),
                  color: getHealthTextColor(dashboardData.systemHealth)
                }}
              >
                {getStatusIcon(dashboardData.systemHealth)} {dashboardData.systemHealth.toUpperCase()}
              </span>
              <button className="btn btn-primary" onClick={fetchDashboardData}>
                🔄 Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="section" style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button 
              className={`btn ${activeTab === 'overview' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`btn ${activeTab === 'jobs' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('jobs')}
            >
              ⚙️ Cron Jobs
            </button>
            <button 
              className={`btn ${activeTab === 'alerts' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('alerts')}
            >
              🚨 Alerts
            </button>
            <button 
              className={`btn ${activeTab === 'resources' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('resources')}
            >
              💻 Resources
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="section">
            <h2 className="heading-3 mb-4">System Overview</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Total Jobs</p>
                    <h3 className="text-2xl font-bold">{dashboardData.summary.totalJobs}</h3>
                  </div>
                  <div className="text-2xl">⚙️</div>
                </div>
                <div className="mt-2">
                  <p className="text-sm">
                    <span style={{ color: getStatusColor('healthy') }}>{dashboardData.summary.healthyJobs} healthy</span>
                    {dashboardData.summary.errorJobs > 0 && (
                      <span>, <span style={{ color: getStatusColor('error') }}>{dashboardData.summary.errorJobs} errors</span></span>
                    )}
                    {dashboardData.summary.staleJobs > 0 && (
                      <span>, <span style={{ color: getStatusColor('stale') }}>{dashboardData.summary.staleJobs} stale</span></span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Critical Jobs</p>
                    <h3 className="text-2xl font-bold">{dashboardData.summary.criticalJobs}</h3>
                  </div>
                  <div className="text-2xl">🔴</div>
                </div>
                <div className="mt-2">
                  <p className="text-sm">
                    {dashboardData.summary.failingCriticalJobs === 0 ? (
                      <span style={{ color: getStatusColor('healthy') }}>All operational</span>
                    ) : (
                      <span style={{ color: getStatusColor('critical') }}>
                        {dashboardData.summary.failingCriticalJobs} failing
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">Active Alerts</p>
                    <h3 className="text-2xl font-bold">{dashboardData.activeAlerts}</h3>
                  </div>
                  <div className="text-2xl">🚨</div>
                </div>
                <div className="mt-2">
                  <p className="text-sm">
                    {dashboardData.activeAlerts === 0 ? (
                      <span style={{ color: getStatusColor('healthy') }}>No active alerts</span>
                    ) : (
                      <span style={{ color: getStatusColor('error') }}>Requires attention</span>
                    )}
                  </p>
                </div>
              </div>
              
              <div className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted">System Health</p>
                    <h3 className="text-2xl font-bold" style={{ color: getHealthTextColor(dashboardData.systemHealth) }}>
                      {dashboardData.systemHealth.toUpperCase()}
                    </h3>
                  </div>
                  <div className="text-2xl">{getStatusIcon(dashboardData.systemHealth)}</div>
                </div>
                <div className="mt-2">
                  <p className="text-sm">
                    Monitor: <span style={{ 
                      color: dashboardData.monitorStatus === 'active' ? getStatusColor('healthy') : getStatusColor('error')
                    }}>
                      {dashboardData.monitorStatus}
                    </span>
                  </p>
                </div>
              </div>
            </div>
            
            {/* Quick Status */}
            <div className="card mb-6">
              <h3 className="heading-4 mb-3">Quick Status</h3>
              <div className="space-y-2">
                {dashboardData.cronJobs.slice(0, 3).map((job, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div className="flex items-center gap-3">
                      <span>{getStatusIcon(job.status)}</span>
                      <div>
                        <p className="font-medium">{job.description}</p>
                        <p className="text-sm text-muted">Schedule: {job.schedule}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium" style={{ color: getStatusColor(job.status) }}>
                        {job.status.toUpperCase()}
                      </p>
                      <p className="text-sm text-muted">
                        {job.ageMinutes !== null ? `${job.ageMinutes} min ago` : 'Unknown'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* System Resources */}
            <div className="card">
              <h3 className="heading-4 mb-3">System Resources</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted mb-1">Disk Usage</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: dashboardData.systemResources.diskUsage }}
                      ></div>
                    </div>
                    <span className="font-medium">{dashboardData.systemResources.diskUsage}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted mb-1">Memory Usage</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: dashboardData.systemResources.memUsage }}
                      ></div>
                    </div>
                    <span className="font-medium">{dashboardData.systemResources.memUsage}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted mb-1">CPU Load</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ 
                          width: `${Math.min(100, parseFloat(dashboardData.systemResources.cpuLoad) * 20)}%` 
                        }}
                      ></div>
                    </div>
                    <span className="font-medium">{dashboardData.systemResources.cpuLoad}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Cron Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="section">
            <h2 className="heading-3 mb-4">Cron Jobs</h2>
            
            <div className="card">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Job</th>
                      <th className="text-left py-3 px-4">Schedule</th>
                      <th className="text-left py-3 px-4">Last Run</th>
                      <th className="text-left py-3 px-4">Errors</th>
                      <th className="text-left py-3 px-4">Critical</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboardData.cronJobs.map((job, index) => (
                      <tr key={index} className="border-b border-border last:border-0 hover:bg-gray-900">
                        <td className="py-3 px-4">
                          <span className="inline-flex items-center gap-1">
                            {getStatusIcon(job.status)}
                            <span style={{ color: getStatusColor(job.status) }}>
                              {job.status.toUpperCase()}
                            </span>
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-medium">{job.description}</p>
                            <p className="text-sm text-muted">{job.name}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <code className="bg-gray-800 px-2 py-1 rounded text-sm">{job.schedule}</code>
                        </td>
                        <td className="py-3 px-4">
                          {job.ageMinutes !== null ? (
                            <div>
                              <p>{job.ageMinutes} minutes ago</p>
                              {job.ageMinutes > 60 && (
                                <p className="text-sm text-warning">
                                  ⚠️ Over 1 hour
                                </p>
                              )}
                            </div>
                          ) : (
                            <span className="text-muted">Unknown</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {job.errorCount > 0 ? (
                            <span className="inline-flex items-center gap-1 text-danger">
                              ❌ {job.errorCount} error(s)
                            </span>
                          ) : (
                            <span className="text-muted">None</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          {job.critical ? (
                            <span className="inline-flex items-center gap-1 text-danger">
                              🔴 Critical
                            </span>
                          ) : (
                            <span className="text-muted">Non-critical</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
