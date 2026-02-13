import { useEffect, useState } from 'react'

interface Transaction {
  tx_hash: string
  wallet: string
  wallet_label?: string
  tx_type: string
  chain: string
  timestamp: number
  token0_symbol: string
  token0_amount: number
  token0_amount_usd: number
  token1_symbol: string
  token1_amount: number
  is_sell: boolean
  dex: string
}

export default function LiveWhaleFeed() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState('')
  const [error, setError] = useState('')

  const fetchWhales = async () => {
    try {
      // Using Cielo API - free tier
      const res = await fetch(
        'https://feed-api.cielo.finance/api/v1/feed?limit=10&chains=solana,base&min_usd=100',
        {
          headers: {
            'X-Api-Key': '93771acc-c2fc-455d-b8e7-263ccd61da4a',
            'Accept': 'application/json'
          }
        }
      )
      
      if (!res.ok) throw new Error('Failed to fetch')
      
      const data = await res.json()
      
      if (data?.data?.items) {
        setTransactions(data.data.items)
        setLastUpdate(new Date().toLocaleTimeString())
        setLoading(false)
      }
    } catch (err) {
      setError('Using demo data - API limit reached')
      // Fallback demo data
      setTransactions([
        {
          tx_hash: 'abc123',
          wallet: '57rXqaQsvgyBKwebP2StfqQeCBjBS4jsrZFJN5aU2V9b',
          wallet_label: '57rX (DEPLOYER)',
          tx_type: 'swap',
          chain: 'solana',
          timestamp: Date.now() / 1000,
          token0_symbol: 'SOL',
          token0_amount: 9.87,
          token0_amount_usd: 771.60,
          token1_symbol: 'thankful',
          token1_amount: 160246448,
          is_sell: false,
          dex: 'PumpFun'
        },
        {
          tx_hash: 'def456',
          wallet: 'BHBASEQ1197',
          wallet_label: 'BHBASEQ1197',
          tx_type: 'swap',
          chain: 'base',
          timestamp: Date.now() / 1000 - 60,
          token0_symbol: 'ETH',
          token0_amount: 0.1,
          token0_amount_usd: 387.98,
          token1_symbol: 'APGARENA',
          token1_amount: 1000000,
          is_sell: false,
          dex: 'Uniswap'
        },
        {
          tx_hash: 'ghi789',
          wallet: '57rXqaQsvgyBKwebP2StfqQeCBjBS4jsrZFJN5aU2V9b',
          wallet_label: '57rX (DEPLOYER)',
          tx_type: 'swap',
          chain: 'solana',
          timestamp: Date.now() / 1000 - 120,
          token0_symbol: 'pem',
          token0_amount: 432074293,
          token0_amount_usd: 1646.52,
          token1_symbol: 'SOL',
          token1_amount: 21.04,
          is_sell: true,
          dex: 'PumpFun'
        }
      ])
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWhales()
    // Refresh every 30 seconds
    const interval = setInterval(fetchWhales, 30000)
    return () => clearInterval(interval)
  }, [])

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() / 1000 - timestamp))
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    return `${Math.floor(seconds / 3600)}h ago`
  }

  const getWalletDisplay = (tx: Transaction) => {
    if (tx.wallet_label) {
      return tx.wallet_label.split(' ')[0].slice(0, 12)
    }
    return tx.wallet.slice(0, 8) + '...'
  }

  const getTokenDisplay = (tx: Transaction) => {
    // Return the token being bought (not SOL/ETH/native)
    if (tx.token0_symbol === 'SOL' || tx.token0_symbol === 'ETH') {
      return tx.token1_symbol
    }
    return tx.token0_symbol
  }

  if (loading) {
    return (
      <div style={{
        background: 'rgba(18, 18, 26, 0.9)',
        border: '1px solid rgba(0, 255, 136, 0.2)',
        borderRadius: '12px',
        padding: '20px',
        color: 'rgba(255, 255, 255, 0.5)',
        textAlign: 'center'
      }}>
        🐋 Loading whale transactions...
      </div>
    )
  }

  return (
    <div style={{
      background: 'rgba(18, 18, 26, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(0, 255, 136, 0.2)',
      borderRadius: '12px',
      padding: '20px',
      maxWidth: '100%'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px',
        paddingBottom: '12px',
        borderBottom: '1px solid rgba(0, 255, 136, 0.2)'
      }}>
        <span style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#00ff88',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          🐋 Live Whale Transactions
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {error && (
            <span style={{ fontSize: '10px', color: '#ff6b35' }}>{error}</span>
          )}
          {lastUpdate && (
            <span style={{ fontSize: '10px', color: 'rgba(255, 255, 255, 0.4)' }}>
              {lastUpdate}
            </span>
          )}
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#00ff88'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              background: '#00ff88',
              borderRadius: '50%',
              animation: 'pulse 1s ease-in-out infinite'
            }} />
            LIVE
          </span>
        </div>
      </div>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxHeight: '400px',
        overflowY: 'auto'
      }}>
        {transactions.map((tx, i) => (
          <a
            key={tx.tx_hash}
            href={`https://solscan.io/tx/${tx.tx_hash}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '14px',
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '8px',
              borderLeft: `3px solid ${tx.is_sell ? '#ff4757' : '#00ff88'}`,
              textDecoration: 'none',
              color: 'inherit',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              fontSize: '13px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(0, 255, 136, 0.05)'
              e.currentTarget.style.transform = 'translateX(4px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.3)'
              e.currentTarget.style.transform = 'translateX(0)'
            }}
          >
            <span style={{
              fontSize: '16px',
              minWidth: '24px'
            }}>
              {tx.is_sell ? '🔴' : '🟢'}
            </span>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '4px'
              }}>
                <span style={{
                  fontWeight: 600,
                  color: '#00d4ff',
                  fontSize: '12px'
                }}>
                  {getWalletDisplay(tx)}
                </span>
                
                <span style={{
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 600,
                  background: tx.is_sell ? 'rgba(255, 71, 87, 0.2)' : 'rgba(0, 255, 136, 0.2)',
                  color: tx.is_sell ? '#ff4757' : '#00ff88'
                }}>
                  {tx.is_sell ? 'SELL' : 'BUY'}
                </span>
                
                <span style={{
                  color: '#ff6b35',
                  fontWeight: 600
                }}>
                  ${getTokenDisplay(tx)}
                </span>
              </div>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '11px'
              }}>
                <span style={{ color: '#00ff88' }}>
                  ${tx.token0_amount_usd.toLocaleString()}
                </span>
                <span>{tx.chain}</span>
                <span>{tx.dex}</span>
                <span style={{ marginLeft: 'auto' }}>{formatTime(tx.timestamp)}</span>
              </div>
            </div>
          </a>
        ))}
      </div>
      
      <div style={{
        marginTop: '12px',
        textAlign: 'center',
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.4)'
      }}>
        Updates every 30s • Powered by Cielo Finance • Click to view on Solscan
      </div>
    </div>
  )
}
