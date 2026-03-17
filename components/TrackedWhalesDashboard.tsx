import { useEffect, useState } from 'react'

interface TrackedWallet {
  address: string
  label?: string
  last_active: number
  total_transactions: number
  total_volume_usd: number
  success_rate?: number
  tags: string[]
}

interface WhaleTransaction {
  tx_hash: string
  wallet: string
  tx_type: string
  chain: string
  timestamp: number
  token_symbol: string
  amount_usd: number
  is_buy: boolean
  profit_loss?: number
}

export default function TrackedWhalesDashboard() {
  const [wallets, setWallets] = useState<TrackedWallet[]>([])
  const [transactions, setTransactions] = useState<WhaleTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'wallets' | 'transactions'>('wallets')
  const [stats, setStats] = useState({
    total_wallets: 0,
    total_volume: 0,
    active_today: 0,
    avg_success_rate: 0
  })

  // Demo data - in production this would come from our API
  const demoWallets: TrackedWallet[] = [
    {
      address: '7uy4...Xz9q',
      label: 'Solana Whale',
      last_active: Date.now() / 1000 - 3600, // 1 hour ago
      total_transactions: 147,
      total_volume_usd: 12450000,
      success_rate: 0.78,
      tags: ['meme-coins', 'early-buyer']
    },
    {
      address: 'aBc3...DeF9',
      label: 'Meme Coin King',
      last_active: Date.now() / 1000 - 7200, // 2 hours ago
      total_transactions: 89,
      total_volume_usd: 8760000,
      success_rate: 0.82,
      tags: ['meme-coins', 'pump-fun']
    },
    {
      address: 'XyZ1...2345',
      label: 'DeFi Degenerate',
      last_active: Date.now() / 1000 - 10800, // 3 hours ago
      total_transactions: 203,
      total_volume_usd: 45200000,
      success_rate: 0.65,
      tags: ['defi', 'liquidity']
    },
    {
      address: '6789...WxYz',
      label: 'NFT Flipper',
      last_active: Date.now() / 1000 - 14400, // 4 hours ago
      total_transactions: 56,
      total_volume_usd: 3210000,
      success_rate: 0.71,
      tags: ['nfts', 'magic-eden']
    },
    {
      address: 'Inst...Wall',
      label: 'Institutional',
      last_active: Date.now() / 1000 - 18000, // 5 hours ago
      total_transactions: 34,
      total_volume_usd: 98700000,
      success_rate: 0.88,
      tags: ['institutional', 'long-term']
    }
  ]

  const demoTransactions: WhaleTransaction[] = [
    {
      tx_hash: 'abc123',
      wallet: '7uy4...Xz9q',
      tx_type: 'swap',
      chain: 'solana',
      timestamp: Date.now() / 1000 - 1800, // 30 minutes ago
      token_symbol: 'BONK',
      amount_usd: 2412750,
      is_buy: true,
      profit_loss: 0.12
    },
    {
      tx_hash: 'def456',
      wallet: 'aBc3...DeF9',
      tx_type: 'swap',
      chain: 'solana',
      timestamp: Date.now() / 1000 - 3600, // 1 hour ago
      token_symbol: 'WIF',
      amount_usd: 1875000,
      is_buy: false,
      profit_loss: 0.34
    },
    {
      tx_hash: 'ghi789',
      wallet: 'XyZ1...2345',
      tx_type: 'swap',
      chain: 'solana',
      timestamp: Date.now() / 1000 - 5400, // 1.5 hours ago
      token_symbol: 'JUP',
      amount_usd: 925000,
      is_buy: true,
      profit_loss: 0.08
    },
    {
      tx_hash: 'jkl012',
      wallet: '6789...WxYz',
      tx_type: 'transfer',
      chain: 'solana',
      timestamp: Date.now() / 1000 - 7200, // 2 hours ago
      token_symbol: 'SOL',
      amount_usd: 125000,
      is_buy: false,
      profit_loss: -0.05
    },
    {
      tx_hash: 'mno345',
      wallet: 'Inst...Wall',
      tx_type: 'swap',
      chain: 'solana',
      timestamp: Date.now() / 1000 - 9000, // 2.5 hours ago
      token_symbol: 'PYTH',
      amount_usd: 2393822,
      is_buy: false,
      profit_loss: 0.21
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setWallets(demoWallets)
      setTransactions(demoTransactions)
      
      // Calculate stats
      const totalVolume = demoWallets.reduce((sum, w) => sum + w.total_volume_usd, 0)
      const avgSuccessRate = demoWallets.reduce((sum, w) => sum + (w.success_rate || 0), 0) / demoWallets.length
      const activeToday = demoWallets.filter(w => w.last_active > Date.now() / 1000 - 86400).length
      
      setStats({
        total_wallets: demoWallets.length,
        total_volume: totalVolume,
        active_today: activeToday,
        avg_success_rate: avgSuccessRate
      })
      
      setLoading(false)
    }, 1000)
  }, [])

  const formatUSD = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(1)}K`
    }
    return `$${amount.toFixed(0)}`
  }

  const formatTime = (timestamp: number) => {
    const seconds = Math.floor((Date.now() / 1000 - timestamp))
    if (seconds < 60) return `${seconds}s ago`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
    return `${Math.floor(seconds / 86400)}d ago`
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(0)}%`
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
        🐋 Loading tracked whales dashboard...
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
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
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
          🦈 Tracked Whales Dashboard
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
            NEO SYSTEM ACTIVE
          </span>
        </div>
      </div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '12px',
        marginBottom: '20px'
      }}>
        <div style={{
          background: 'rgba(0, 255, 136, 0.05)',
          border: '1px solid rgba(0, 255, 136, 0.2)',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
            Tracked Wallets
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#00ff88' }}>
            {stats.total_wallets}
          </div>
        </div>
        
        <div style={{
          background: 'rgba(0, 212, 255, 0.05)',
          border: '1px solid rgba(0, 212, 255, 0.2)',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
            Total Volume
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#00d4ff' }}>
            {formatUSD(stats.total_volume)}
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255, 107, 53, 0.05)',
          border: '1px solid rgba(255, 107, 53, 0.2)',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
            Active Today
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#ff6b35' }}>
            {stats.active_today}
          </div>
        </div>
        
        <div style={{
          background: 'rgba(147, 51, 234, 0.05)',
          border: '1px solid rgba(147, 51, 234, 0.2)',
          borderRadius: '8px',
          padding: '12px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255, 255, 255, 0.6)', marginBottom: '4px' }}>
            Avg Success Rate
          </div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#9333ea' }}>
            {formatPercentage(stats.avg_success_rate)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '8px',
        marginBottom: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        paddingBottom: '8px'
      }}>
        <button
          onClick={() => setActiveTab('wallets')}
          style={{
            padding: '8px 16px',
            background: activeTab === 'wallets' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
            border: '1px solid',
            borderColor: activeTab === 'wallets' ? '#00ff88' : 'rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: activeTab === 'wallets' ? '#00ff88' : 'rgba(255, 255, 255, 0.6)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          🐋 Tracked Wallets ({wallets.length})
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          style={{
            padding: '8px 16px',
            background: activeTab === 'transactions' ? 'rgba(0, 255, 136, 0.2)' : 'transparent',
            border: '1px solid',
            borderColor: activeTab === 'transactions' ? '#00ff88' : 'rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            color: activeTab === 'transactions' ? '#00ff88' : 'rgba(255, 255, 255, 0.6)',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          📊 Recent Transactions ({transactions.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'wallets' ? (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}>
          {wallets.map((wallet, i) => (
            <div
              key={wallet.address}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '14px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                borderLeft: `3px solid ${wallet.success_rate && wallet.success_rate > 0.7 ? '#00ff88' : '#ff6b35'}`,
                transition: 'all 0.2s ease',
                cursor: 'pointer'
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
                {i + 1}
              </span>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px'
                }}>
                  <span style={{
                    fontWeight: 600,
                    color: '#00d4ff',
                    fontSize: '13px'
                  }}>
                    {wallet.label || wallet.address}
                  </span>
                  
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    background: 'rgba(0, 212, 255, 0.2)',
                    color: '#00d4ff'
                  }}>
                    {formatUSD(wallet.total_volume_usd)}
                  </span>
                  
                  {wallet.success_rate && (
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600,
                      background: wallet.success_rate > 0.7 ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 107, 53, 0.2)',
                      color: wallet.success_rate > 0.7 ? '#00ff88' : '#ff6b35'
                    }}>
                      {formatPercentage(wallet.success_rate)} win rate
                    </span>
                  )}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '11px'
                }}>
                  <span>{wallet.total_transactions} transactions</span>
                  <span>Last active: {formatTime(wallet.last_active)}</span>
                  <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
                    {wallet.tags.map(tag => (
                      <span
                        key={tag}
                        style={{
                          padding: '2px 6px',
                          background: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '4px',
                          fontSize: '10px'
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
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
                borderLeft: `3px solid ${tx.is_buy ? '#00ff88' : '#ff4757'}`,
                textDecoration: 'none',
                color: 'inherit',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
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
                {tx.is_buy ? '🟢' : '🔴'}
              </span>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '6px'
                }}>
                  <span style={{
                    fontWeight: 600,
                    color: '#00d4ff',
                    fontSize: '12px'
                  }}>
                    {tx.wallet}
                  </span>
                  
                  <span style={{
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: 600,
                    background: tx.is_buy ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                    color: tx.is_buy ? '#00ff88' : '#ff4757'
                  }}>
                    {tx.is_buy ? 'BUY' : 'SELL'}
                  </span>
                  
                  <span style={{
                    color: '#ff6b35',
                    fontWeight: 600
                  }}>
                    ${tx.token_symbol}
                  </span>
                  
                  <span style={{
                    color: tx.is_buy ? '#00ff88' : '#ff4757',
                    fontWeight: 600
                  }}>
                    {formatUSD(tx.amount_usd)}
                  </span>
                  
                  {tx.profit_loss !== undefined && (
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '10px',
                      fontWeight: 600,
                      background: tx.profit_loss > 0 ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 71, 87, 0.2)',
                      color: tx.profit_loss > 0 ? '#00ff88' : '#ff4757'
                    }}>
                      {tx.profit_loss > 0 ? '+' : ''}{formatPercentage(tx.profit_loss)}
                    </span>
                  )}
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '11px'
                }}>
                  <span>{tx.chain}</span>
                  <span>{tx.tx_type}</span>
                  <span style={{ marginLeft: 'auto' }}>{formatTime(tx.timestamp)}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
      
      <div style={{
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(0, 255, 136, 0.2)',
        textAlign: 'center',
        fontSize: '11px',
        color: 'rgba(255, 255, 255, 0.4)'
      }}>
        <div style={{ marginBottom: '8px' }}>
          <span style={{ color: '#00ff88' }}>NEO SYSTEM STATUS:</span> 
          <span style={{ marginLeft: '8px' }}>✅ Whale tracking active</span>
          <span style={{ marginLeft: '16px' }}>✅ Content generation ready</span>
          <span style={{ marginLeft: '16px' }}>✅ Telegram alerts configured</span>
        </div>
        Powered by Cielo API + Neo Crypto Engine • Part of the Matrix Army 🦎
      </div>
    </div>
  )
}