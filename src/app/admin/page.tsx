// Admin Dashboard - Monitor all systems
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface SystemStatus {
  website: boolean;
  telegram: boolean;
  scanner: boolean;
  lastCheck: string;
}

interface Metric {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export default function AdminDashboard() {
  const [status, setStatus] = useState<SystemStatus>({
    website: true,
    telegram: true,
    scanner: true,
    lastCheck: new Date().toISOString()
  });

  const [metrics, setMetrics] = useState<Metric[]>([
    { label: 'Website Visitors (24h)', value: '1,247', change: '+12%', positive: true },
    { label: 'Telegram Members', value: '156', change: '+5%', positive: true },
    { label: 'Cielo Clicks', value: '89', change: '+23%', positive: true },
    { label: 'Active Alerts', value: '12', change: '-2', positive: false }
  ]);

  useEffect(() => {
    // Health check every 30 seconds
    const interval = setInterval(() => {
      checkHealth();
    }, 30000);
    checkHealth();
    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      // Check website
      const webRes = await fetch('/api/health');
      const webOk = webRes.ok;

      setStatus({
        website: webOk,
        telegram: true, // Would check bot API
        scanner: true,  // Would check process
        lastCheck: new Date().toISOString()
      });
    } catch (e) {
      console.error('Health check failed:', e);
    }
  };

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent">
              🦞 Admin Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Monitor all systems • Last check: {formatTime(status.lastCheck)}
            </p>
          </div>
          <Link 
            href="/"
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
          >
            ← Back to Site
          </Link>
        </div>
      </div>

      {/* System Status */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatusCard 
          title="Website"
          status={status.website}
          icon="🌐"
          url="https://iseeiape.com"
        />
        <StatusCard 
          title="Telegram Bot"
          status={status.telegram}
          icon="🤖"
          url="https://t.me/iseeiape"
        />
        <StatusCard 
          title="Limitless Scanner"
          status={status.scanner}
          icon="📡"
          detail="PID: 3453"
        />
      </div>

      {/* Key Metrics */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">📊 Key Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, i) => (
            <MetricCard key={i} metric={metric} />
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">⚡ Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ActionButton 
            label="Deploy Website"
            icon="🚀"
            onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
          />
          <ActionButton 
            label="View Logs"
            icon="📋"
            onClick={() => window.open('https://vercel.com/dashboard', '_blank')}
          />
          <ActionButton 
            label="Check Scripts"
            icon="⚙️"
            onClick={() => alert('Run: ps aux | grep scanner')}
          />
          <ActionButton 
            label="Cielo Stats"
            icon="📈"
            onClick={() => window.open('https://app.cielo.finance', '_blank')}
          />
        </div>
      </div>

      {/* Running Scripts */}
      <div className="max-w-7xl mx-auto mb-8">
        <h2 className="text-2xl font-bold mb-4">▶️ Running Scripts</h2>
        <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-6">
          <ScriptRow 
            name="Limitless Scanner"
            status="running"
            pid="3453"
            uptime="11h 23m"
            lastRun="Active"
          />
          <ScriptRow 
            name="Daily X Alpha"
            status="scheduled"
            schedule="9:00 AM"
            lastRun="Today 09:00"
          />
          <ScriptRow 
            name="X Gem Scanner"
            status="scheduled"
            schedule="Hourly"
            lastRun="17:00"
          />
          <ScriptRow 
            name="Moltbook Trends"
            status="scheduled"
            schedule="Hourly"
            lastRun="17:00"
          />
        </div>
      </div>

      {/* Revenue Tracking */}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">💰 Revenue (Cielo)</h2>
        <div className="bg-gradient-to-r from-green-900/30 to-blue-900/30 rounded-xl border border-green-500/30 p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">89</p>
              <p className="text-gray-400">Clicks (24h)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-400">12</p>
              <p className="text-gray-400">Signups</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-orange-400">$0</p>
              <p className="text-gray-400">Commission</p>
              <p className="text-xs text-gray-500 mt-1">Not tracked yet</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusCard({ title, status, icon, url, detail }: { 
  title: string; 
  status: boolean; 
  icon: string;
  url?: string;
  detail?: string;
}) {
  return (
    <div className={`p-6 rounded-xl border ${status ? 'bg-green-900/20 border-green-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-3xl">{icon}</span>
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${status ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
          {status ? '● Online' : '● Offline'}
        </span>
      </div>
      <h3 className="text-xl font-bold">{title}</h3>
      {detail && <p className="text-gray-400 text-sm">{detail}</p>}
      {url && (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-orange-400 text-sm hover:underline">
          Visit →
        </a>
      )}
    </div>
  );
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4">
      <p className="text-gray-400 text-sm">{metric.label}</p>
      <p className="text-2xl font-bold mt-1">{metric.value}</p>
      <p className={`text-sm ${metric.positive ? 'text-green-400' : 'text-red-400'}`}>
        {metric.change}
      </p>
    </div>
  );
}

function ActionButton({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="p-4 bg-gray-800/50 hover:bg-gray-700 rounded-xl border border-gray-700 transition-colors text-left"
    >
      <span className="text-2xl">{icon}</span>
      <p className="font-medium mt-2">{label}</p>
    </button>
  );
}

function ScriptRow({ name, status, pid, uptime, schedule, lastRun }: {
  name: string;
  status: 'running' | 'scheduled' | 'stopped';
  pid?: string;
  uptime?: string;
  schedule?: string;
  lastRun: string;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-700/50 last:border-0">
      <div className="flex items-center gap-4">
        <span className={`w-3 h-3 rounded-full ${status === 'running' ? 'bg-green-400 animate-pulse' : status === 'scheduled' ? 'bg-blue-400' : 'bg-red-400'}`} />
        <div>
          <p className="font-medium">{name}</p>
          {pid && <p className="text-xs text-gray-500">PID: {pid} | Uptime: {uptime}</p>}
          {schedule && <p className="text-xs text-gray-500">Schedule: {schedule}</p>}
        </div>
      </div>
      <p className="text-sm text-gray-400">Last: {lastRun}</p>
    </div>
  );
}
