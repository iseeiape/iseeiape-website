import { useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
export default function Redirect() {
  const router = useRouter()
  useEffect(() => { router.replace("/master") }, [router])
  return (
    <>
      <Head>
        <title>Dashboard — iseeiape | Smart Money Intelligence</title>
        <meta name="description" content="Real-time smart money dashboard tracking whale wallets and on-chain alpha signals on Solana and Base. Redirecting to master dashboard." />
        <meta name="robots" content="index, follow" />
      </Head>
      <h1 style={{ position: "absolute", left: "-9999px" }}>Smart Money Dashboard — iseeiape</h1>
    </>
  )
}
