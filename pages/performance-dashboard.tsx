import { useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
export default function Redirect() {
  const router = useRouter()
  useEffect(() => { router.replace("/master") }, [router])
  return (
    <>
      <Head>
        <title>Performance Dashboard — iseeiape | Token Performance Tracker</title>
        <meta name="description" content="Track token performance across Solana and Base. Historical ROI, win rates, and smart money performance analytics. Redirecting to master dashboard." />
        <meta name="robots" content="index, follow" />
      </Head>
      <h1 style={{ position: "absolute", left: "-9999px" }}>Performance Dashboard — iseeiape</h1>
    </>
  )
}
