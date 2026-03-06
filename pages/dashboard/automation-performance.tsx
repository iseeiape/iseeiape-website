import Layout from '../../components/Layout'
import Head from 'next/head'
import { useState, useEffect } from 'react'

interface AutomationMetric {
  id: string
  name: string
  value: number
  target: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  change: number
}

interface ContentPerformance {
  type: string
  posts: number
  engagement: number
  qualityScore: number
  cost: number
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical'
  lastCheck: string
  uptime: number
  errors: number
}

export default function AutomationPerformance() {
  const [metrics, setMetrics] = useState<AutomationMetric[]>([
    { id: 'posts', name: 'Total Posts', value: 342, target: 500, unit: 'posts', trend: 'up', change: 12 },
    { id: 'engagement', name: 'Avg Engagement', value: 4.2, target: 5, unit: '%', trend: 'up', change: 0.8 },
    { id: 'quality', name: 'Content Quality', value: 82, target: 75, unit: '/100', trend: 'stable', change: 2 },
    { id: 'cost', name: 'Cost per Post', value: 0.02, target: 0.015, unit: 'USD', trend: 'down', change: -0.005 },
    { id: 'uptime', name: 'System Uptime', value: 99.7, target: 99.5, unit: '%', trend: 'up', change: 0.2 },
    { id: 'generation', name: 'Content Generated', value: 156, target: 200, unit: 'items', trend: 'up', change: 24 },
  ])

  const [contentPerformance, setContentPerformance] = useState<ContentPerformance[]>([
    { type: 'Whale Alerts', posts: 89, engagement: 6.8, qualityScore: 88, cost: 0.018 },
    { type: 'Trend Alerts', posts: 67, engagement: 4.2, qualityScore: 82, cost: 0.022 },
    { type: 'Market Updates', posts: 45, engagement: 3.5, qualityScore: 79, cost: 0.025 },
    { type: 'Educational', posts: 78, engagement: 5.1, qualityScore: 85, cost: 0.020 },
    { type: 'Technical Analysis', posts: 34, engagement: 4.8, qualityScore: 81, cost: 0.028 },
    { type: 'Sentiment Reports', posts: 29, engagement: 3.9, qualityScore: 77, cost: 0.030 },
  ])

  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    status: 'healthy',
    lastCheck: '2026-03-07 00:15:00',
    uptime: 99.7,
    errors: 3
  })

  const [recentActivity, setRecentActivity] = useState([
    { time: '00:10', action: 'Whale alert generated', status: 'success', cost: 0.018 },
    { time: '23:45', action: 'Market data updated', status: 'success', cost: 0.002 },
    { time: '23:30', action: 'Trend alert posted', status: 'success', cost: 0.022 },
    { time: '23:15', action: 'Article generated', status: 'success', cost: 0.045 },
    { time: '23:00', action: 'Content batch scheduled', status: 'success', cost: 0.015 },
    { time: '22:45', action: 'System health check', status: 'success', cost: 0.001 },
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-green-100 text-green-800'
      case 'warning': return 'bg-yellow-100 text-yellow-800'
      case 'critical': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      case 'stable': return '→'
      default: return '→'
    }
  }

  return (
    <Layout 
      title="Automation Performance Dashboard | iseeiape"
      description="Real-time monitoring of content automation system performance, costs, and engagement metrics."
      breadcrumbs={[
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'Automation Performance', path: '/dashboard/automation-performance' }
      ]}
    >
      <Head>
        <title>Automation Performance Dashboard | iseeiape</title>
        <meta name="description" content="Real-time monitoring of content automation system performance, costs, and engagement metrics." />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Automation Performance Dashboard</h1>
          <p className="text-gray-600 mt-2">Monitor your content automation system in real-time</p>
          
          <div className="mt-4 flex items-center space-x-4">
            <div className={`px-4 py-2 rounded-full ${getStatusColor(systemHealth.status)}`}>
              System Status: <span className="font-bold">{systemHealth.status.toUpperCase()}</span>
            </div>
            <div className="text-gray-600">
              Last check: {systemHealth.lastCheck}
            </div>
            <div className="text-gray-600">
              Uptime: {systemHealth.uptime}%
            </div>
          </div>
        </header>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {metrics.map((metric) => (
            <div key={metric.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">{metric.name}</h3>
                  <div className="mt-2 flex items-baseline">
                    <span className="text-3xl font-bold text-gray-900">{metric.value}</span>
                    <span className="ml-2 text-gray-600">{metric.unit}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full ${metric.trend === 'up' ? 'bg-green-100 text-green-800' : metric.trend === 'down' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                  {getTrendIcon(metric.trend)} {metric.change > 0 ? '+' : ''}{metric.change}{metric.unit === '%' ? '%' : ''}
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{Math.min(100, Math.round((metric.value / metric.target) * 100))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${metric.value >= metric.target ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${Math.min(100, (metric.value / metric.target) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-sm text-gray-500 mt-1">Target: {metric.target}{metric.unit}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Performance Table */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Content Performance by Type</h2>
            <p className="text-gray-600">Detailed breakdown of automation output and engagement</p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Content Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Posts</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engagement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quality Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost per Post</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ROI Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contentPerformance.map((content) => {
                  const roiScore = Math.round((content.engagement * 100) / (content.cost * 1000))
                  return (
                    <tr key={content.type} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">{content.type}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{content.posts}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-gray-900">{content.engagement}%</div>
                          <div className={`ml-2 px-2 py-1 rounded text-xs ${content.engagement > 5 ? 'bg-green-100 text-green-800' : content.engagement > 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                            {content.engagement > 5 ? 'High' : content.engagement > 3 ? 'Medium' : 'Low'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="text-gray-900">{content.qualityScore}</div>
                          <div className="ml-2 w-24 bg-gray-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-blue-500"
                              style={{ width: `${content.qualityScore}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">${content.cost.toFixed(3)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${roiScore > 250 ? 'bg-green-100 text-green-800' : roiScore > 150 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                          {roiScore}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-800">Recent Activity</h2>
            <p className="text-gray-600">Latest automation actions and system events</p>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity, index) => (
              <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                <div className="flex items-center">
                  <div className={`w-3 h-3 rounded-full mr-3 ${activity.status === 'success' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <div>
                    <div className="font-medium text-gray-900">{activity.action}</div>
                    <div className="text-sm text-gray-500">{activity.time}</div>
                  </div>
                </div>
                <div className="text-gray-600">
                  Cost: ${activity.cost.toFixed(3)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Cost Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Today's Cost</span>
                <span className="font-medium">$0.123</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Weekly Cost</span>
                <span className="font-medium">$0.85</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Monthly Cost</span>
                <span className="font-medium">$3.42</span>
              </div>
              <div className="flex justify-between pt-3 border-t">
                <span className="text-gray-600 font-medium">Cost per 1k Engagement</span>
                <span className="font-bold text-green-600">$2.15</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Optimization Tips</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Whale alerts have highest ROI - increase frequency</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-500 mr-2">⚠</span>
                <span>Sentiment reports cost too much - consider cheaper model</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">💡</span>
                <span>Educational content drives consistent engagement</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>System uptime exceeds target - good reliability</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition">
                Generate Performance Report
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg transition">
                Optimize Content Schedule
              </button>
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition">
                Run Cost Analysis
              </button>
              <button className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition">
                View Detailed Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}