import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'

// WAR ROOM - The Ultimate Crypto Command Center
export default function WarRoom() {
  const [mounted, setMounted] = useState(false)
  const [tick, setTick] = useState(0)
  const [typedText, setTypedText] = useState('')
  const fullText = 'WELCOME TO THE WAR ROOM'
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Live data simulation
  const [prices, setPrices] = useState([
    { symbol: 'BONK', price: 0.00001234, change: 45.2 },
    { symbol: 'WIF', price: 0.2345, change: 23.8 },
    { symbol: 'PEPE', price: 0.00000876, change: -12.3 },
    { symbol: 'FARTCOIN', price: 0.0456, change: 189.4 },
    { symbol: 'MOODENG', price: 0.1234, change: 67.2 },
    { symbol: 'AI16Z', price: 0.5678, change: -5.4 },
  ])

  const whales = [
    { name: 'WHALE_17', action: 'BUY', token: '$BIGTROUT', amount: '$89.4K', time: '2s ago' },
    { name: 'WHALE_42', action: 'SELL', token: '$BONK', amount: '$234K', time: '5s ago' },
    { name: 'SMART_MONEY', action: 'BUY', token: '$WIF', amount: '$45.2K', time: '8s ago' },
    { name: 'SOLANA_OG', action: 'BUY', token: '$FARTCOIN', amount: '$12.1K', time: '12s ago' },
  ]

  const stats = [
    { label: 'ACTIVE WALLETS', value: 1337, suffix: '' },
    { label: '24H VOLUME', value: 42.5, suffix: 'M' },
    { label: 'PROFIT TRACKED', value: 1.37, suffix: 'M' },
    { label: 'ALERTS TODAY', value: 69, suffix: '' },
  ]

  // Typing effect
  useEffect(() => {
    setMounted(true)
    let i = 0
    const typeInterval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i))
        i++
      } else {
        clearInterval(typeInterval)
      }
    }, 100)
    return () => clearInterval(typeInterval)
  }, [])

  // Matrix rain effect
  useEffect(() => {
    if (!canvasRef.current || !mounted) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = '0123456789ABCDEF$#@%&'
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = Array(Math.floor(columns)).fill(1)

    const draw = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#00ff8833'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(char, i * fontSize, drops[i] * fontSize)
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 35)
    
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [mounted])

  // Live price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => prev.map(p => ({
        ...p,
        price: p.price * (1 + (Math.random() - 0.5) * 0.02),
        change: p.change + (Math.random() - 0.5) * 2
      })))
      setTick(t => t + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) return null

  return (
    <>
      <Head>
        <title>WAR ROOM | iseeiape</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <style>{`
        :root {
          --neon-green: #00ff88;
          --neon-blue: #00d4ff;
          --neon-red: #ff4757;
          --neon-orange: #ff6b35;
          --bg-dark: #0a0a0f;
          --bg-card: rgba(18, 18, 26, 0.8);
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'JetBrains Mono', monospace;
          background: var(--bg-dark);
          color: #fff;
          overflow-x: hidden;
        }
        
        .war-room {
          position: relative;
          min-height: 100vh;
          display: grid;
          grid-template-rows: auto auto 1fr auto;
          padding-bottom: 60px;
        }
        
        .matrix-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          pointer-events: none;
        }
        
        .content {
          position: relative;
          z-index: 1;
          padding: 20px;
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          min-height: calc(100vh - 200px);
        }
        
        @media (min-width: 1200px) {
          .content {
            grid-template-columns: 300px 1fr 300px;
            height: calc(100vh - 160px);
          }
        }
        
        .panel {
          background: var(--bg-card);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(0, 255, 136, 0.2);
          border-radius: 12px;
          padding: 20px;
          overflow: hidden;
        }
        
        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(0, 255, 136, 0.2);
        }
        
        .panel-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--neon-green);
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .live-indicator {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 12px;
          color: var(--neon-green);
        }
        
        .live-dot {
          width: 8px;
          height: 8px;
          background: var(--neon-green);
          border-radius: 50%;
          animation: pulse 1s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        
        .header {
          position: relative;
          z-index: 1;
          text-align: center;
          padding: 30px 20px;
          border-bottom: 1px solid rgba(0, 255, 136, 0.2);
        }
        
        .header h1 {
          font-size: clamp(24px, 5vw, 48px);
          font-weight: 700;
          color: var(--neon-green);
          text-shadow: 0 0 20px rgba(0, 255, 136, 0.5);
          margin-bottom: 10px;
        }
        
        .header .cursor {
          display: inline-block;
          width: 3px;
          height: 1em;
          background: var(--neon-green);
          animation: blink 1s step-end infinite;
          margin-left: 5px;
        }
        
        @keyframes blink {
          50% { opacity: 0; }
        }
        
        .subtitle {
          color: rgba(255, 255, 255, 0.6);
          font-size: 14px;
          text-transform: uppercase;
          letter-spacing: 4px;
        }
        
        .stat-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .stat-box {
          background: rgba(0, 255, 136, 0.05);
          border: 1px solid rgba(0, 255, 136, 0.1);
          border-radius: 8px;
          padding: 16px;
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .stat-box:hover {
          border-color: var(--neon-green);
          box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
        }
        
        .stat-value {
          font-size: 24px;
          font-weight: 700;
          color: var(--neon-green);
          text-shadow: 0 0 10px rgba(0, 255, 136, 0.5);
        }
        
        .stat-label {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-top: 4px;
        }
        
        .price-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .price-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          border-left: 3px solid var(--neon-green);
          transition: all 0.3s ease;
        }
        
        .price-item:hover {
          background: rgba(0, 255, 136, 0.05);
          transform: translateX(5px);
        }
        
        .price-item.negative {
          border-left-color: var(--neon-red);
        }
        
        .price-symbol {
          font-weight: 600;
          font-size: 14px;
        }
        
        .price-value {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.8);
        }
        
        .price-change {
          font-size: 12px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 4px;
        }
        
        .price-change.positive {
          color: var(--neon-green);
          background: rgba(0, 255, 136, 0.1);
        }
        
        .price-change.negative {
          color: var(--neon-red);
          background: rgba(255, 71, 87, 0.1);
        }
        
        .feed {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: calc(100vh - 300px);
          overflow-y: auto;
        }
        
        .feed-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          font-size: 12px;
          animation: slideIn 0.3s ease;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .feed-whale {
          color: var(--neon-blue);
          font-weight: 600;
          min-width: 100px;
        }
        
        .feed-action {
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: 600;
          font-size: 10px;
        }
        
        .feed-action.buy {
          background: rgba(0, 255, 136, 0.2);
          color: var(--neon-green);
        }
        
        .feed-action.sell {
          background: rgba(255, 71, 87, 0.2);
          color: var(--neon-red);
        }
        
        .feed-token {
          color: var(--neon-orange);
          font-weight: 600;
        }
        
        .feed-amount {
          color: var(--neon-green);
          margin-left: auto;
        }
        
        .feed-time {
          color: rgba(255, 255, 255, 0.4);
          font-size: 10px;
        }
        
        .ticker {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(10, 10, 15, 0.95);
          border-top: 1px solid rgba(0, 255, 136, 0.3);
          padding: 15px 0;
          overflow: hidden;
          z-index: 10;
        }
        
        .ticker-content {
          display: flex;
          gap: 60px;
          animation: scroll 30s linear infinite;
          white-space: nowrap;
        }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        
        .ticker-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
        }
        
        .ticker-symbol {
          font-weight: 700;
          color: var(--neon-green);
        }
        
        .ticker-price {
          font-family: 'JetBrains Mono', monospace;
          color: #fff;
        }
        
        .ticker-change {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
        }
        
        .center-panel {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        
        .visualizer {
          flex: 1;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 12px;
          border: 1px solid rgba(0, 255, 136, 0.2);
          position: relative;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .visualizer-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: 
            linear-gradient(rgba(0, 255, 136, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 255, 136, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }
        
        .visualizer-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }
        
        .big-number {
          font-size: clamp(60px, 10vw, 120px);
          font-weight: 700;
          color: var(--neon-green);
          text-shadow: 0 0 40px rgba(0, 255, 136, 0.5);
          line-height: 1;
        }
        
        .big-label {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 4px;
          margin-top: 10px;
        }
        
        .mini-stats {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }
        
        @media (min-width: 640px) {
          .mini-stats {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        .mini-stat {
          text-align: center;
          padding: 16px;
          background: rgba(0, 255, 136, 0.05);
          border-radius: 8px;
          border: 1px solid rgba(0, 255, 136, 0.1);
        }
        
        .mini-stat-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--neon-green);
        }
        
        .mini-stat-label {
          font-size: 10px;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          margin-top: 4px;
        }
      `}</style>

      <div className="war-room">
        <canvas ref={canvasRef} className="matrix-bg" />
        
        <header className="header">
          <h1>{typedText}<span className="cursor" /></h1>
          <p className="subtitle">Smart Money Intelligence Terminal</p>
        </header>

        <div className="content">
          {/* Left Panel - Stats */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">System Status</span>
              <div className="live-indicator">
                <span className="live-dot" />
                LIVE
              </div>
            </div>
            
            <div className="stat-grid">
              {stats.map((stat, i) => (
                <div key={i} className="stat-box">
                  <div className="stat-value">
                    {stat.value.toLocaleString()}{stat.suffix}
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '20px' }}>
              <div className="panel-header">
                <span className="panel-title">Top Movers</span>
              </div>
              <div className="price-list">
                {prices.map((price, i) => (
                  <div key={i} className={`price-item ${price.change < 0 ? 'negative' : ''}`}>
                    <span className="price-symbol">${price.symbol}</span>
                    <span className="price-value">${price.price.toFixed(6)}</span>
                    <span className={`price-change ${price.change >= 0 ? 'positive' : 'negative'}`}>
                      {price.change >= 0 ? '+' : ''}{price.change.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel - Main Visualizer */}
          <div className="center-panel">
            <div className="visualizer">
              <div className="visualizer-grid" />
              <div className="visualizer-content">
                <div className="big-number">+10,075%</div>
                <div className="big-label">Best ROI This Week</div>
              </div>
            </div>
            
            <div className="mini-stats">
              <div className="mini-stat">
                <div className="mini-stat-value">24/7</div>
                <div className="mini-stat-label">Monitoring</div>
              </div>
              <div className="mini-stat">
                <div className="mini-stat-value">&lt;2s</div>
                <div className="mini-stat-label">Latency</div>
              </div>
              <div className="mini-stat">
                <div className="mini-stat-value">99.9%</div>
                <div className="mini-stat-label">Uptime</div>
              </div>
            </div>
          </div>

          {/* Right Panel - Live Feed */}
          <div className="panel">
            <div className="panel-header">
              <span className="panel-title">Whale Activity</span>
              <div className="live-indicator">
                <span className="live-dot" />
                REAL-TIME
              </div>
            </div>
            
            <div className="feed">
              {whales.map((whale, i) => (
                <div key={i} className="feed-item">
                  <span className="feed-whale">{whale.name}</span>
                  <span className={`feed-action ${whale.action.toLowerCase()}`}>
                    {whale.action}
                  </span>
                  <span className="feed-token">{whale.token}</span>
                  <span className="feed-amount">{whale.amount}</span>
                  <span className="feed-time">{whale.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Ticker */}
        <div className="ticker">
          <div className="ticker-content">
            {[...prices, ...prices].map((price, i) => (
              <div key={i} className="ticker-item">
                <span className="ticker-symbol">${price.symbol}</span>
                <span className="ticker-price">${price.price.toFixed(6)}</span>
                <span className={`ticker-change ${price.change >= 0 ? 'positive' : 'negative'}`}>
                  {price.change >= 0 ? '▲' : '▼'} {Math.abs(price.change).toFixed(1)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
