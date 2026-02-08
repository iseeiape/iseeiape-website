// Analytics tracking endpoint
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ANALYTICS_DIR = path.join(process.cwd(), 'data', 'analytics');
const CLICKS_FILE = path.join(ANALYTICS_DIR, 'clicks.json');
const DAILY_FILE = path.join(ANALYTICS_DIR, 'daily.json');

// Ensure analytics directory exists
if (!fs.existsSync(ANALYTICS_DIR)) {
  fs.mkdirSync(ANALYTICS_DIR, { recursive: true });
}

interface ClickEvent {
  timestamp: string;
  type: 'token_click' | 'wallet_click' | 'general_click';
  target: string;
  source: string;
  userAgent?: string;
  ip?: string;
  referrer?: string;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, target, source } = body;
    
    // Basic validation
    if (!type || !target) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Get request info
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const referrer = request.headers.get('referer') || 'direct';
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    // Create click event
    const clickEvent: ClickEvent = {
      timestamp: new Date().toISOString(),
      type: type as ClickEvent['type'],
      target,
      source: source || 'unknown',
      userAgent,
      ip,
      referrer
    };
    
    // Save to clicks file
    let clicks = [];
    if (fs.existsSync(CLICKS_FILE)) {
      try {
        clicks = JSON.parse(fs.readFileSync(CLICKS_FILE, 'utf8'));
      } catch (error) {
        console.warn('Could not parse clicks file, starting fresh');
      }
    }
    
    clicks.push(clickEvent);
    
    // Keep only last 10,000 clicks
    if (clicks.length > 10000) {
      clicks = clicks.slice(-10000);
    }
    
    fs.writeFileSync(CLICKS_FILE, JSON.stringify(clicks, null, 2));
    
    // Update daily stats
    updateDailyStats(clickEvent);
    
    return NextResponse.json({
      success: true,
      message: 'Click tracked',
      event: clickEvent
    });
    
  } catch (error) {
    console.error('Analytics tracking error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function updateDailyStats(clickEvent: ClickEvent) {
  const today = new Date().toISOString().split('T')[0];
  let dailyStats = {};
  
  if (fs.existsSync(DAILY_FILE)) {
    try {
      dailyStats = JSON.parse(fs.readFileSync(DAILY_FILE, 'utf8'));
    } catch (error) {
      console.warn('Could not parse daily stats file, starting fresh');
    }
  }
  
  // Initialize today's stats if not exists
  if (!dailyStats[today]) {
    dailyStats[today] = {
      totalClicks: 0,
      tokenClicks: 0,
      walletClicks: 0,
      generalClicks: 0,
      sources: {},
      targets: {}
    };
  }
  
  // Update stats
  const todayStats = dailyStats[today];
  todayStats.totalClicks++;
  
  switch (clickEvent.type) {
    case 'token_click':
      todayStats.tokenClicks++;
      break;
    case 'wallet_click':
      todayStats.walletClicks++;
      break;
    case 'general_click':
      todayStats.generalClicks++;
      break;
  }
  
  // Track sources
  todayStats.sources[clickEvent.source] = (todayStats.sources[clickEvent.source] || 0) + 1;
  
  // Track targets (limited to top 100)
  todayStats.targets[clickEvent.target] = (todayStats.targets[clickEvent.target] || 0) + 1;
  
  // Keep only last 30 days
  const dates = Object.keys(dailyStats).sort();
  if (dates.length > 30) {
    const toRemove = dates.slice(0, dates.length - 30);
    toRemove.forEach(date => delete dailyStats[date]);
  }
  
  fs.writeFileSync(DAILY_FILE, JSON.stringify(dailyStats, null, 2));
}

// GET endpoint to retrieve analytics (protected in production)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const days = parseInt(searchParams.get('days') || '7');
  
  try {
    let dailyStats = {};
    if (fs.existsSync(DAILY_FILE)) {
      try {
        dailyStats = JSON.parse(fs.readFileSync(DAILY_FILE, 'utf8'));
      } catch (error) {
        console.warn('Could not parse daily stats file');
      }
    }
    
    // Filter by days
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    const cutoffStr = cutoffDate.toISOString().split('T')[0];
    
    const filteredStats = Object.entries(dailyStats)
      .filter(([date]) => date >= cutoffStr)
      .reduce((acc, [date, stats]) => {
        acc[date] = stats;
        return acc;
      }, {});
    
    // Calculate totals
    const totals = {
      totalClicks: 0,
      tokenClicks: 0,
      walletClicks: 0,
      generalClicks: 0,
      days: Object.keys(filteredStats).length
    };
    
    Object.values(filteredStats).forEach((stats: any) => {
      totals.totalClicks += stats.totalClicks || 0;
      totals.tokenClicks += stats.tokenClicks || 0;
      totals.walletClicks += stats.walletClicks || 0;
      totals.generalClicks += stats.generalClicks || 0;
    });
    
    // Get top sources and targets
    const allSources = {};
    const allTargets = {};
    
    Object.values(filteredStats).forEach((stats: any) => {
      Object.entries(stats.sources || {}).forEach(([source, count]) => {
        allSources[source] = (allSources[source] || 0) + (count as number);
      });
      
      Object.entries(stats.targets || {}).forEach(([target, count]) => {
        allTargets[target] = (allTargets[target] || 0) + (count as number);
      });
    });
    
    // Sort and get top 10
    const topSources = Object.entries(allSources)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([source, count]) => ({ source, count }));
    
    const topTargets = Object.entries(allTargets)
      .sort(([, a], [, b]) => (b as number) - (a as number))
      .slice(0, 10)
      .map(([target, count]) => ({ target, count }));
    
    return NextResponse.json({
      success: true,
      period: `${days} days`,
      totals,
      topSources,
      topTargets,
      dailyStats: filteredStats
    });
    
  } catch (error) {
    console.error('Analytics retrieval error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}