            {/* Recommendations */}
            <div className={`rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'} p-6 backdrop-blur-sm`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>🚀 Recommendations</h2>
              <div className="space-y-4">
                {recommendations.map((rec, idx) => (
                  <div 
                    key={idx}
                    className={`p-4 rounded-xl border-l-4`}
                    style={{ 
                      borderLeftColor: getPriorityColor(rec.priority),
                      backgroundColor: darkMode ? 'rgba(31, 41, 55, 0.5)' : 'rgba(243, 244, 246, 0.5)'
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: getPriorityColor(rec.priority) }}
                        />
                        <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {rec.title}
                        </span>
                      </div>
                      <span 
                        className="text-xs font-medium px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: getPriorityColor(rec.priority) + '20',
                          color: getPriorityColor(rec.priority)
                        }}
                      >
                        {rec.priority.toUpperCase()}
                      </span>
                    </div>
                    <p className={`text-sm mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {rec.description}
                    </p>
                    <div className={`text-xs ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      💡 {rec.action}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Alerts */}
            <div className={`rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'} p-6 backdrop-blur-sm`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>🔄 Recent Alerts</h2>
              <div className="space-y-3">
                {metrics?.recent_alerts.slice(0, 8).map((alert, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: getCategoryColor(alert.category) + '20' }}
                      >
                        <span className="text-sm font-bold" style={{ color: getCategoryColor(alert.category) }}>
                          {alert.symbol?.charAt(0) || '?'}
                        </span>
                      </div>
                      <div>
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {alert.symbol}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {alert.category} • {alert.time_ago}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold" style={{ color: getReturnColor(alert.return_1h) }}>
                        {formatPercentage(alert.return_1h)}
                      </div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Score: {alert.score}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Trends */}
            <div className={`rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'} p-6 backdrop-blur-sm`}>
              <h2 className={`text-xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>📈 Daily Trends</h2>
              <div className="space-y-4">
                {metrics?.trends.map((trend, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {trend.date}
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`} style={{ color: getReturnColor(trend.avg_return) }}>
                          {formatPercentage(trend.avg_return)}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Return</div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {trend.alerts}
                        </div>
                        <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Alerts</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        <div className={`mt-8 p-6 rounded-2xl ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white/50 border border-gray-200'} backdrop-blur-sm`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {metrics?.overview.wins || 0}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Winning Alerts (+20%)</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {metrics?.overview.rug_pulls || 0}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Rug Pulls</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {metrics?.overview.alerts_with_returns || 0}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Alerts with Returns</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {formatNumber((metrics?.overview.alerts_with_returns || 0) - (metrics?.overview.rug_pulls || 0), 0)}
              </div>
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Tokens</div>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <div className={`mt-8 p-6 rounded-2xl ${darkMode ? 'bg-blue-900/20 border border-blue-800/50' : 'bg-blue-50 border border-blue-200'} backdrop-blur-sm`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${darkMode ? 'bg-blue-800/50' : 'bg-blue-100'}`}>
              <span className="text-xl">ℹ️</span>
            </div>
            <div>
              <h3 className={`text-lg font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Fixed Performance Metrics
              </h3>
              <p className={`${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                This dashboard now shows accurate performance data after fixing the price fetching issue. 
                Previously, 98.5% of alerts were incorrectly marked as "delisted" due to using pair addresses 
                instead of token addresses. The system now correctly identifies and fetches prices for both 
                pair and token addresses.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-blue-800/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  ✅ Fixed Price Fetching
                </span>
                <span className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-blue-800/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  📊 Accurate Returns
                </span>
                <span className={`text-xs px-3 py-1 rounded-full ${darkMode ? 'bg-blue-800/50 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
                  🐺 Real Wolf Pack Data
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`mt-12 border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'} py-6`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              🦎 iseeiape • Wolf Pack Performance Dashboard • v1.0
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchPerformanceData}
                className={`px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-200 hover:bg-gray-300'} transition-colors`}
              >
                🔄 Refresh
              </button>
              <div className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Last updated: {data?.timestamp ? new Date(data.timestamp).toLocaleString() : 'Never'}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}