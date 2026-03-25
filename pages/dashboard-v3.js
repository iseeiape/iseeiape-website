// pages/dashboard-v3.js - Test page for MarketDashboardV3
import MarketDashboardV3 from '../components/MarketDashboardV3';
import Head from 'next/head';

export default function DashboardV3Page() {
  return (
    <>
      <Head>
        <title>Neo Dashboard v3 - Real-time Market Intelligence</title>
        <meta name="description" content="Enhanced dashboard with caching, advanced analytics, and real-time market data from Wolf Alerts" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <MarketDashboardV3 />
      
      <div className="fixed bottom-4 right-4 bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl p-4 max-w-sm">
        <h4 className="font-semibold mb-2">Dashboard v3 Features</h4>
        <ul className="text-sm text-gray-300 space-y-1">
          <li>✅ In-memory caching for faster responses</li>
          <li>✅ Advanced market metrics & analytics</li>
          <li>✅ Multiple view modes (cards, table, compact)</li>
          <li>✅ Real-time auto-refresh (30s intervals)</li>
          <li>✅ Risk level & confidence indicators</li>
          <li>✅ Performance monitoring</li>
          <li>✅ Responsive design</li>
        </ul>
        <div className="mt-3 text-xs text-gray-400">
          Built by Neo Night Shift • {new Date().toLocaleDateString()}
        </div>
      </div>
    </>
  );
}