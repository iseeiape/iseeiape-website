// pages/api/wolf-performance.js - Wolf Pack performance metrics API
import fs from 'fs';
import path from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export default async function handler(req, res) {
  try {
    // Database path
    const dbPath = path.join(process.cwd(), '../../wolf_performance.db');
    
    if (!fs.existsSync(dbPath)) {
      return res.status(200).json({
        success: false,
        error: 'Performance database not found',
        data: getSamplePerformanceData()
      });
    }

    // Open database
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Get performance metrics
    const now = Math.floor(Date.now() / 1000);
    const dayAgo = now - 86400;
    const weekAgo = now - 7 * 86400;

    // Overall stats
    const overallStats = await db.get(`
      SELECT 
        COUNT(*) as total_alerts,
        COUNT(CASE WHEN return_1h IS NOT NULL AND return_1h > -998 THEN 1 END) as alerts_with_returns,
        COUNT(CASE WHEN return_1h = -999 THEN 1 END) as rug_pulls,
        COUNT(CASE WHEN return_1h >= 20 THEN 1 END) as wins,
        AVG(CASE WHEN return_1h > -998 THEN return_1h END) as avg_return
      FROM alerts
      WHERE timestamp > ?
    `, [weekAgo]);

    // Category breakdown
    const categoryStats = await db.all(`
      SELECT 
        category,
        COUNT(*) as total,
        COUNT(CASE WHEN return_1h = -999 THEN 1 END) as rug_pulls,
        COUNT(CASE WHEN return_1h >= 20 THEN 1 END) as wins,
        AVG(CASE WHEN return_1h > -998 THEN return_1h END) as avg_return
      FROM alerts
      WHERE timestamp > ? AND category IS NOT NULL
      GROUP BY category
      ORDER BY avg_return DESC
    `, [weekAgo]);

    // Recent alerts (last 24h)
    const recentAlerts = await db.all(`
      SELECT 
        symbol,
        category,
        score,
        return_1h,
        timestamp,
        volume_24h
      FROM alerts
      WHERE timestamp > ?
      ORDER BY timestamp DESC
      LIMIT 20
    `, [dayAgo]);

    // Performance trends (last 7 days)
    const dailyTrends = await db.all(`
      SELECT 
        DATE(datetime(timestamp, 'unixepoch')) as date,
        COUNT(*) as alerts,
        COUNT(CASE WHEN return_1h = -999 THEN 1 END) as rug_pulls,
        AVG(CASE WHEN return_1h > -998 THEN return_1h END) as avg_return
      FROM alerts
      WHERE timestamp > ?
      GROUP BY date
      ORDER BY date DESC
      LIMIT 7
    `, [weekAgo]);

    // Top performers
    const topPerformers = await db.all(`
      SELECT 
        symbol,
        category,
        score,
        return_1h,
        volume_24h
      FROM alerts
      WHERE return_1h IS NOT NULL AND return_1h > -998
      ORDER BY return_1h DESC
      LIMIT 10
    `);

    // Worst performers
    const worstPerformers = await db.all(`
      SELECT 
        symbol,
        category,
        score,
        return_1h,
        volume_24h
      FROM alerts
      WHERE return_1h IS NOT NULL AND return_1h > -998
      ORDER BY return_1h ASC
      LIMIT 10
    `);

    await db.close();

    // Calculate derived metrics
    const totalAlerts = overallStats.total_alerts || 0;
    const alertsWithReturns = overallStats.alerts_with_returns || 0;
    const rugPulls = overallStats.rug_pulls || 0;
    const wins = overallStats.wins || 0;
    const avgReturn = overallStats.avg_return || 0;

    const rugPullRate = alertsWithReturns > 0 ? (rugPulls / alertsWithReturns) * 100 : 0;
    const winRate = alertsWithReturns > 0 ? (wins / alertsWithReturns) * 100 : 0;

    // Prepare response
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      metrics: {
        overview: {
          total_alerts: totalAlerts,
          alerts_with_returns: alertsWithReturns,
          rug_pulls: rugPulls,
          wins: wins,
          avg_return: avgReturn,
          rug_pull_rate: rugPullRate,
          win_rate: winRate
        },
        categories: categoryStats.map(cat => ({
          ...cat,
          rug_pull_rate: cat.total > 0 ? (cat.rug_pulls / cat.total) * 100 : 0,
          win_rate: cat.total > 0 ? (cat.wins / cat.total) * 100 : 0
        })),
        trends: dailyTrends,
        recent_alerts: recentAlerts.map(alert => ({
          ...alert,
          time_ago: formatTimeAgo(alert.timestamp)
        })),
        top_performers: topPerformers,
        worst_performers: worstPerformers
      },
      recommendations: generateRecommendations({
        rugPullRate,
        avgReturn,
        winRate
      })
    };

    res.status(200).json(response);

  } catch (error) {
    console.error('Error fetching Wolf performance:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      data: getSamplePerformanceData()
    });
  }
}

function formatTimeAgo(timestamp) {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function generateRecommendations(metrics) {
  const recs = [];
  
  if (metrics.rugPullRate > 50) {
    recs.push({
      priority: 'high',
      title: 'High Rug Pull Rate',
      description: `Current rug pull rate is ${metrics.rugPullRate.toFixed(1)}%. Implement stricter filters.`,
      action: 'Add minimum liquidity/volume thresholds'
    });
  }
  
  if (metrics.avgReturn < -20) {
    recs.push({
      priority: 'high',
      title: 'Negative Average Returns',
      description: `Average return is ${metrics.avgReturn.toFixed(1)}%. Improve scoring algorithm.`,
      action: 'Adjust scoring weights and add on-chain verification'
    });
  }
  
  if (metrics.winRate < 10) {
    recs.push({
      priority: 'medium',
      title: 'Low Win Rate',
      description: `Win rate is only ${metrics.winRate.toFixed(1)}%. Focus on quality over quantity.`,
      action: 'Increase minimum score thresholds'
    });
  }
  
  if (recs.length === 0) {
    recs.push({
      priority: 'low',
      title: 'Performance Stable',
      description: 'Current metrics are within acceptable ranges.',
      action: 'Continue monitoring and optimize incrementally'
    });
  }
  
  return recs;
}

function getSamplePerformanceData() {
  return {
    overview: {
      total_alerts: 324,
      alerts_with_returns: 324,
      rug_pulls: 310,
      wins: 2,
      avg_return: -957.2,
      rug_pull_rate: 95.7,
      win_rate: 0.6
    },
    categories: [
      {
        category: 'newpairs',
        total: 205,
        rug_pulls: 205,
        wins: 0,
        avg_return: -980.0,
        rug_pull_rate: 100.0,
        win_rate: 0.0
      },
      {
        category: 'momentum',
        total: 96,
        rug_pulls: 96,
        wins: 0,
        avg_return: -958.4,
        rug_pull_rate: 100.0,
        win_rate: 0.0
      },
      {
        category: 'alpha',
        total: 23,
        rug_pulls: 9,
        wins: 2,
        avg_return: -748.6,
        rug_pull_rate: 39.1,
        win_rate: 8.7
      }
    ],
    recommendations: [
      {
        priority: 'high',
        title: 'Critical Rug Pull Issue',
        description: '95.7% of alerts are rug pulls. Immediate action required.',
        action: 'Implement volume filters and symbol exclusions'
      }
    ]
  };
}