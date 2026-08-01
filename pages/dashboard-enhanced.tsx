import { useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
export default function Redirect() {
  const router = useRouter()
  useEffect(() => { router.replace("/master") }, [router])
  return (
    <>
      <Head>
        <title>Enhanced Dashboard — iseeiape | Smart Money Analytics</title>
        <meta name="description" content="Enhanced smart money dashboard with real-time whale tracking, on-chain analytics, and alpha signals for Solana and Base tokens. Redirecting to master dashboard." />
        <meta name="robots" content="index, follow" />
      </Head>
      <h1 style={{ position: "absolute", left: "-9999px" }}>Enhanced Dashboard — iseeiape</h1>
    </>
  )
}
