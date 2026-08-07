import { useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"

// Night shift 2026-08-08: Converted from full page (232 lines) to redirect.
// The old page imported 4 components (MarketDashboardEnhanced, SystemStatus,
// LiveWhaleFeed, XTrends) that are not used by the active /master dashboard.
// This page is linked from one insight article (neo-dashboard-v3-launch).
export default function Redirect() {
  const router = useRouter()
  useEffect(() => { router.replace("/master") }, [router])
  return (
    <>
      <Head>
        <title>Dashboard v3 — iseeiape | Smart Money Intelligence</title>
        <meta name="description" content="Enhanced real-time crypto market dashboard with whale alerts, AI-powered insights, and live trading signals. Redirecting to master dashboard." />
        <meta name="robots" content="index, follow" />
      </Head>
      <h1 style={{ position: "absolute", left: "-9999px" }}>Enhanced Dashboard v3 — iseeiape</h1>
    </>
  )
}
