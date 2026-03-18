// components/SystemStatus.js - System status display component
import { useState, useEffect } from 'react';

export default function SystemStatus() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatus();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/system-status');
      if (!response.ok) throw new Error('Failed to fetch status');
      const data = await response.json();
      setStatus(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching system status:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !status) {
    return (
      <div className="p-4 border rounded-lg bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
          <span className="text-sm font-medium">Loading system status...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 border rounded-lg bg-red-50 border-red-200">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <span className="text-sm font-medium text-red-800">Status check failed</span>
        </div>
        <p className="mt-1 text-sm text-red-600">{error}</p>
        <button
          onClick={fetchStatus}
          className="mt-2 px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200"
        >
          Retry
        </button>
      </div>
    );
  }

  const { health, components, timestamp, recommendations } = status;

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            health.overall === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
          }`}></div>
          <h3 className="font-medium">System Status</h3>
        </div>
        <span className="text-xs text-gray-500">
          {new Date(timestamp).toLocaleTimeString()}
        </span>
      </div>

      {/* Wolf Pack Status */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Wolf Pack Engine</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              components.wolfPack.liveData ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span>Live Data</span>
          </div>
          <div className="text-gray-600">
            {components.wolfPack.alertCount || 0} alerts
          </div>
          
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              components.wolfPack.dashboardData ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span>Dashboard Data</span>
          </div>
          <div className="text-gray-600">
            {components.wolfPack.ageMinutes !== undefined ? 
              `${components.wolfPack.ageMinutes}m ago` : 'Unknown'
            }
          </div>
        </div>
      </div>

      {/* Cron Jobs */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-2">Cron Jobs</h4>
        {components.cronJobs.recentJobs.length > 0 ? (
          <div className="space-y-1">
            {components.cronJobs.recentJobs.map((job, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="font-medium">{job.job}</span>
                <span className="text-gray-600">
                  {new Date(job.lastRun).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-yellow-600">No recent job executions</p>
        )}
      </div>

      {/* Content Generation */}
      {components.contentGeneration.recentContent.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium mb-2">Recent Content</h4>
          <div className="space-y-1">
            {components.contentGeneration.recentContent.map((content, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="truncate">{content.type}</span>
                <span className="text-gray-600 text-xs">
                  {new Date(content.generated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-medium mb-2 text-yellow-700">Recommendations</h4>
          <ul className="space-y-1">
            {recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-yellow-600 flex items-start">
                <span className="mr-1">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4 pt-4 border-t">
        <button
          onClick={fetchStatus}
          className="w-full px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 flex items-center justify-center"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh Status
        </button>
      </div>
    </div>
  );
}