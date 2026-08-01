import { useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
export default function Redirect() {
  const router = useRouter()
  useEffect(() => { router.replace("/master") }, [router])
  return (
    <>
      <Head>
        <title>War Room — iseeiape | Crypto Trading Intelligence Terminal</title>
        <meta name="description" content="Real-time crypto trading war room with on-chain analytics, whale tracking, and alpha signals for Solana and Base. Redirecting to master dashboard." />
        <meta name="robots" content="index, follow" />
      </Head>
      <h1 style={{ position: "absolute", left: "-9999px" }}>War Room — iseeiape</h1>
    </>
  )
}
