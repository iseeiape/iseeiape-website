import { useEffect } from "react"
import { useRouter } from "next/router"
import Head from "next/head"
export default function Redirect() {
  const router = useRouter()
  useEffect(() => { router.replace("/master") }, [router])
  return (
    <>
      <Head>
        <title>Wolf Alerts — iseeiape | Solana Token Scanner Alerts</title>
        <meta name="description" content="Wolf Alert System scans 500+ Solana and Base tokens every 15 minutes for momentum, whale accumulation, and early entry signals. Redirecting to master dashboard." />
        <meta name="robots" content="index, follow" />
      </Head>
      <h1 style={{ position: "absolute", left: "-9999px" }}>Wolf Alerts — Solana Token Scanner</h1>
    </>
  )
}
