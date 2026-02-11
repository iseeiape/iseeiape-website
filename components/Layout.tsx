import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/router'

interface LayoutProps {
  children: React.ReactNode
  title?: string
  description?: string
}

export default function Layout({ children, title = 'iseeiape', description = 'Smart Money Intelligence for Solana & Base' }: LayoutProps) {
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

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
      </Head>

      {/* Desktop Navigation */}
      <nav className="nav">
        <div className="container nav-container">
          <Link href="/" className="nav-brand">
            <span>🦎</span>
            <span>iseeiape</span>
          </Link>

          <div className="nav-links hidden md:flex">
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

          <div className="flex items-center gap-4">
            <Link href="/search" className="btn btn-ghost hidden md:flex">
              🔍 Search
            </Link>
            
            <button
              className="btn btn-ghost md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="container">
              <div className="py-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`nav-link block mb-2 ${isActive(link.href) ? 'nav-link-active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.icon} {link.label}
                  </Link>
                ))}
                <Link
                  href="/search"
                  className="nav-link block"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  🔍 Search
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main style={{ paddingBottom: '80px' }}>
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
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
    </>
  )
}
