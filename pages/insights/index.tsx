import Head from 'next/head'
import Layout from '../components/Layout'

export default function Insights() {
  const articles = [
    {
      title: "🤖 AI Agents Are Eating Crypto Markets",
      date: "March 1, 2026",
      slug: "ai-agents-market-dominance",
      description: "How AI agents are dominating crypto trading, creating new alpha opportunities, and what it means for retail traders."
    },
    {
      title: "📈 The Information Edge: How to Stay Ahead of Market Rotations",
      date: "February 27, 2026",
      slug: "information-edge-rotations",
      description: "Learn to identify early warning signals for market rotations and position yourself before the crowd catches on."
    },
    {
      title: "🧠 The Psychology of Smart Money: How Whales Think Differently",
      date: "February 26, 2026",
      slug: "psychology-smart-money",
      description: "Understanding the cognitive patterns and behavioral finance principles that separate smart money from retail traders."
    },
    {
      title: "⚡ From Intelligence to Execution: Building Your Alpha Generation System",
      date: "February 25, 2026",
      slug: "intelligence-to-execution",
      description: "Transform on-chain intelligence into executable trading strategies that print while you sleep."
    },
    {
      title: "🔍 The Three Layers of On-Chain Intelligence",
      date: "February 24, 2026",
      slug: "three-layers-intelligence",
      description: "Understanding Layer 1 (Reactive), Layer 2 (Pattern Recognition), and Layer 3 (Predictive) intelligence."
    },
    {
      title: "🚀 Real-Time On-Chain Analytics: Beyond Whale Watching",
      date: "February 23, 2026",
      slug: "real-time-analytics",
      description: "How predictive algorithms and AI agents are creating the next generation of on-chain analytics."
    }
  ];
  
  return (
    <Layout>
      <Head>
        <title>Insights - iseeiape</title>
        <meta name="description" content="insights articles and analysis from iseeiape." />
      </Head>
      
      <div className="category-container">
        <h1 className="category-title">📈 Insights</h1>
        <p className="category-description">
          Market analysis, trends, and investment insights.
        </p>
        
        <div className="articles-grid">
          {articles.map((item, index) => (
            <div key={index} className="article-card">
              <h2 className="article-card-title">
                <a href={`/insights/${item.slug}`}>{item.title}</a>
              </h2>
              <div className="article-card-meta">
                <span className="article-card-date">{item.date}</span>
              </div>
              <a href={`/insights/${item.slug}`} className="article-card-link">
                Read Article →
              </a>
            </div>
          ))}
        </div>
        
        <div className="back-home">
          <a href="/" className="back-button">
            ← Back to Home
          </a>
        </div>
      </div>
      
      <style jsx>{`
        .category-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 40px 20px;
          color: #fff;
          background: #0a0a0a;
          min-height: 100vh;
        }
        
        .category-title {
          font-size: 36px;
          color: #00ff88;
          margin-bottom: 20px;
        }
        
        .category-description {
          color: #888;
          margin-bottom: 40px;
          font-size: 18px;
        }
        
        .articles-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 40px;
        }
        
        .article-card {
          background: #1a1a1a;
          border-radius: 12px;
          padding: 25px;
          transition: transform 0.3s, background 0.3s;
        }
        
        .article-card:hover {
          transform: translateY(-5px);
          background: #222;
        }
        
        .article-card-title {
          font-size: 20px;
          color: #fff;
          margin-bottom: 15px;
          line-height: 1.3;
        }
        
        .article-card-title a {
          color: inherit;
          text-decoration: none;
        }
        
        .article-card-title a:hover {
          color: #00ff88;
        }
        
        .article-card-meta {
          color: #888;
          font-size: 14px;
          margin-bottom: 20px;
        }
        
        .article-card-link {
          display: inline-block;
          color: #00ff88;
          text-decoration: none;
          font-weight: bold;
        }
        
        .article-card-link:hover {
          text-decoration: underline;
        }
        
        .back-home {
          margin-top: 60px;
          text-align: center;
        }
        
        .back-button {
          display: inline-block;
          padding: 12px 24px;
          background: #00ff88;
          color: #000;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          transition: background 0.3s;
        }
        
        .back-button:hover {
          background: #00cc66;
        }
      `}</style>
    </Layout>
  )
}
