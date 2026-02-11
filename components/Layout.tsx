import Head from 'next/head'
import { useState, useEffect, ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = "iseeiape" }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const navLinks = [
    { href: '/', label: '🏠 Home' },
    { href: '/case-studies', label: '📊 Case Studies' },
    { href: '/guides', label: '📚 Guides' },
    { href: '/insights', label: '💡 Insights' },
    { href: '/dashboard', label: '📈 Dashboard' },
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Search across all content
      const searchPaths = ['/case-studies', '/guides', '/insights']
      // For now, redirect to guides with search param
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      {/* Navigation Header */}
      <nav style={{ 
        background: '#0a0a0a', 
        borderBottom: '1px solid #222',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '15px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <a href="/" style={{ 
            color: '#00ff88', 
            textDecoration: 'none', 
            fontSize: '24px', 
            fontWeight: 'bold' 
          }}>
            🦎 iseeiape
          </a>

          {/* Desktop Nav + Search */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: '20px'
          }}>
            {/* Search Bar */}
            <form onSubmit={handleSearch} style={{ 
              display: isMobile ? 'none' : 'flex',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '8px 15px',
                  borderRadius: '20px',
                  border: '1px solid #333',
                  background: '#111',
                  color: '#fff',
                  width: '200px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  marginLeft: '8px',
                  padding: '8px 15px',
                  borderRadius: '20px',
                  border: 'none',
                  background: '#00ff88',
                  color: '#000',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                🔍
              </button>
            </form>

            {/* Desktop Menu */}
            <div style={{ display: isMobile ? 'none' : 'flex', gap: '15px' }}>
              {navLinks.slice(1).map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  style={{
                    color: '#fff',
                    textDecoration: 'none',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e: any) => e.target.style.background = '#1a1a1a'}
                  onMouseLeave={(e: any) => e.target.style.background = 'transparent'}
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: isMobile ? 'block' : 'none',
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '5px 10px'
              }}
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && isMobile && (
          <div style={{
            background: '#111',
            borderTop: '1px solid #222',
            padding: '20px'
          }}>
            {/* Mobile Search */}
            <form onSubmit={handleSearch} style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 15px',
                  borderRadius: '8px',
                  border: '1px solid #333',
                  background: '#0a0a0a',
                  color: '#fff',
                  marginBottom: '10px',
                  fontSize: '16px'
                }}
              />
              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: '#00ff88',
                  color: '#000',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}
              >
                🔍 Search
              </button>
            </form>

            {/* Mobile Nav Links */}
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'block',
                  color: '#fff',
                  textDecoration: 'none',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                  background: '#1a1a1a',
                  fontSize: '18px'
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#0a0a0a',
          borderTop: '1px solid #222',
          padding: '10px 0',
          zIndex: 100,
          display: 'flex',
          justifyContent: 'space-around'
        }}>
          {[
            { href: '/', icon: '🏠', label: 'Home' },
            { href: '/case-studies', icon: '📊', label: 'Cases' },
            { href: '/guides', icon: '📚', label: 'Guides' },
            { href: '/insights', icon: '💡', label: 'Insights' },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              style={{
                color: '#fff',
                textDecoration: 'none',
                textAlign: 'center',
                fontSize: '12px'
              }}
            >
              <div style={{ fontSize: '20px', marginBottom: '2px' }}>{item.icon}</div>
              {item.label}
            </a>
          ))}
        </nav>
      )}

      {/* Footer spacing for mobile bottom nav */}
      {isMobile && <div style={{ height: '70px' }} />}
    </>
  )
}
