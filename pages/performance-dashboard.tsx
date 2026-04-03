// pages/performance-dashboard.tsx
// Wolf Pack Performance Dashboard Page

import WolfPerformanceDashboard from '../components/WolfPerformanceDashboard';
import Head from 'next/head';

export default function PerformanceDashboardPage() {
  return (
    <>
      <Head>
        <title>🐺 Wolf Pack Performance Dashboard - iseeiape</title>
        <meta name="description" content="Real-time Wolf Pack performance metrics with fixed price fetching and accurate returns analysis" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <WolfPerformanceDashboard />
    </>
  );
}