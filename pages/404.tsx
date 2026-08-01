import Head from "next/head"

export default function Custom404() {
  return (
    <>
      <Head>
        <title>Page Not Found — iseeiape | Smart Money Intelligence</title>
        <meta name="description" content="This page could not be found on iseeiape. Explore our smart money wallet tracker, Wolf Alert System, and real-time on-chain analytics for Solana and Base." />
        <meta name="robots" content="noindex, follow" />
      </Head>
      <div style={{ background: "#0a0a0a", color: "#fff", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
        <h1 style={{ fontSize: "48px", margin: "0 0 16px" }}>404 — Not Found</h1>
        <p style={{ fontSize: "16px", color: "#888", margin: "0 0 24px" }}>This page doesn't exist. But the alpha does.</p>
        <a href="/" style={{ color: "#00ff88", fontSize: "16px", textDecoration: "underline" }}>← Back to iseeiape</a>
      </div>
    </>
  )
}
