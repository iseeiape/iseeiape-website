import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'
import MatrixBackground from './MatrixBackground'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
  showMatrix?: boolean
  ogImage?: string
  canonical?: string
  article?: boolean
  publishDate?: string
  author?: string
}

export default function Layout({ 
  children, 
  title = 'iseeiape - Smart Money Intelligence for Solana & Base', 
  description = 'Track whale wallets, discover alpha, and follow smart money on Solana and Base chains. Real-time intelligence for crypto traders.',
  showMatrix = true,
  ogImage = 'https://www.iseeiape.com/og-image.jpg',
  canonical,
  article = false,
  publishDate,
  author = 'Neo (Matrix Army)'
}: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()

  const navLinks = [
    { href: '/', label: 'Home', icon: '🏠' },
    { href: '/case-studies', label: 'Cases', icon: '📊' },
    { href: '/guides', label: 'Guides', icon: '📚' },
    { href: '/insights', label: 'Insights', icon: '💡' },
    { href: '/dashboard', label: 'Dashboard', icon: '📈' },
  ]

  const isActive = (href: string) => router.pathname === href

  const siteUrl = 'https://www.iseeiape.com'
  const fullUrl = canonical ? `${siteUrl}${canonical}` : siteUrl
  const pageTitle = title.includes('iseeiape') ? title : `${title} | iseeiape`

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={fullUrl} />
        
        {/* Robots */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        
        {/* Open Graph */}
        <meta property="og:type" content={article ? 'article' : 'website'} />
        <meta property="og:url" content={fullUrl} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:site_name" content="iseeiape" />
        <meta property="og:locale" content="en_US" />
        
        {/* Article specific */}
        {article && publishDate && (
          <>
            <meta property="article:published_time" content={publishDate} />
            <meta property="article:author" content={author} />
            <meta property="article:section" content="Crypto Trading" />
            <meta property="article:tag" content="Solana, Base, Smart Money, Whale Tracking" />
          </>
        )}
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content={fullUrl} />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />
        
        {/* Structured Data - Organization */}
        {!article && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "iseeiape",
            "url": siteUrl,
            "logo": `${siteUrl}/logo.png`,
            "description": description,
            "sameAs": [
              "https://twitter.com/iseeiape",
              "https://twitter.com/dog_on_chain"
            ],
            "founder": {
              "@type": "Person",
              "name": "Dan (Lizard King)",
              "url": "https://twitter.com/iseeicode"
            }
          })}} />
        )}
        
        {/* Structured Data - Article */}
        {article && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": title,
            "description": description,
            "image": ogImage,
            "datePublished": publishDate,
            "dateModified": publishDate,
            "author": {
              "@type": "Person",
              "name": author
            },
            "publisher": {
              "@type": "Organization",
              "name": "iseeiape",
              "logo": {
                "@type": "ImageObject",
                "url": `${siteUrl}/logo.png`
              }
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": fullUrl
            }
          })}} />
        )}
        
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        :root {
          --neon-green: #00ff88;
          --neon-blue: #00d4ff;
          --neon-red: #ff4757;
          --neon-orange: #ff6b35;
          --bg-dark: #0a0a0f;
          --bg-card: rgba(18, 18, 26, 0.9);
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Inter', sans-serif;
          background: var(--bg-dark);
          color: #fff;
          min-height: 100vh;
        }
        
        .site-wrapper {
          position: relative;
          min-height: 100vh;
          z-index: 1;
        }
        
        /* Navigation */
        .nav {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 10, 15, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(0, 255, 136, 0.2);
        }
        
        .nav-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 72px;
        }
        
        .nav-brand {
          font-family: 'JetBrains Mono', monospace;
          font-size: 20px;
          font-weight: 700;
          color: var(--neon-green);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 8px;
          text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
        }
        
        .nav-links {
          display: none;
          align-items: center;
          gap: 8px;
        }
        
        @media (min-width: 768px) {
          .nav-links {
            display: flex;
          }
        }
        
        .nav-link {
          font-family: 'JetBrains Mono', monospace;
          padding: 8px 16px;
          color: rgba(255, 255, 255, 0.7);
          text-decoration: none;
          font-size: 13px;
          font-weight: 500;
          border-radius: 8px;
          transition: all 0.2s ease;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .nav-link:hover {
          color: var(--neon-green);
          background: rgba(0, 255, 136, 0.1);
        }
        
        .nav-link-active {
          color: var(--neon-green);
          background: rgba(0, 255, 136, 0.15);
          border: 1px solid rgba(0, 255, 136, 0.3);
        }
        
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 20px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 600;
          border-radius: 8px;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .btn-primary {
          background: var(--neon-green);
          color: #000;
        }
        
        .btn-primary:hover {
          background: #00e67a;
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.4);
          transform: translateY(-1px);
        }
        
        .btn-ghost {
          background: transparent;
          color: rgba(255, 255, 255, 0.7);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .btn-ghost:hover {
          color: var(--neon-green);
          border-color: var(--neon-green);
        }
        
        /* Mobile Menu */
        .mobile-menu {
          display: none;
          padding: 16px 20px;
          border-top: 1px solid rgba(0, 255, 136, 0.1);
        }
        
        .mobile-menu.open {
          display: block;
        }
        
        .mobile-menu .nav-link {
          display: block;
          margin-bottom: 8px;
        }
        
        /* Main Content */
        .main-content {
          position: relative;
          z-index: 1;
          padding-bottom: 80px;
        }
        
        /* Mobile Bottom Nav */
        .mobile-nav {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(10, 10, 15, 0.95);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(0, 255, 136, 0.2);
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
          z-index: 100;
        }
        
        @media (min-width: 768px) {
          .mobile-nav {
            display: none;
          }
          
          .main-content {
            padding-bottom: 0;
          }
        }
        
        .mobile-nav-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 8px 16px;
          color: rgba(255, 255, 255, 0.5);
          text-decoration: none;
          font-size: 11px;
          font-family: 'JetBrains Mono', monospace;
          transition: all 0.2s ease;
        }
        
        .mobile-nav-item:hover,
        .mobile-nav-item-active {
          color: var(--neon-green);
        }
      `}</style>

      {showMatrix && <MatrixBackground />}
      
      <div className="site-wrapper">
        <nav className="nav">
          <div className="nav-container">
            <Link href="/" className="nav-brand">
              <span>🦎</span>
              <span>iseeiape</span>
            </Link>

            <div className="nav-links">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`nav-link ${isActive(link.href) ? 'nav-link-active' : ''}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="nav-actions">
              <Link href="/war-room" className="btn btn-primary hidden md:flex">
                ⚡ War Room
              </Link>
              
              <button
                className="btn btn-ghost md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                ☰
              </button>
            </div>
          </div>

          <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive(link.href) ? 'nav-link-active' : ''}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <Link href="/war-room" className="nav-link">
              ⚡ War Room
            </Link>
          </div>
        </nav>

        <main className="main-content">
          {children}
        </main>

        <nav className="mobile-nav">
          {navLinks.slice(0, 5).map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`mobile-nav-item ${isActive(link.href) ? 'mobile-nav-item-active' : ''}`}
            >
              <span style={{ fontSize: '20px' }}>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}
