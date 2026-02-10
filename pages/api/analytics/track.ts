import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type AnalyticsEvent = {
  timestamp: string;
  eventType: 'page_view' | 'token_click' | 'wallet_click' | 'dashboard_refresh';
  page: string;
  data?: any;
  userAgent?: string;
  ip?: string;
};

const ANALYTICS_FILE = path.join(process.cwd(), 'data', 'analytics.json');

// Ensure data directory exists
const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  if (!fs.existsSync(ANALYTICS_FILE)) {
    fs.writeFileSync(ANALYTICS_FILE, JSON.stringify([], null, 2));
  }
};

const readAnalytics = (): AnalyticsEvent[] => {
  ensureDataDir();
  try {
    const data = fs.readFileSync(ANALYTICS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const writeAnalytics = (events: AnalyticsEvent[]) => {
  ensureDataDir();
  fs.writeFileSync(ANALYTICS_FILE, JSON.stringify(events, null, 2));
};

const getStats = (events: AnalyticsEvent[]) => {
  const last24h = events.filter(event => {
    const eventTime = new Date(event.timestamp).getTime();
    const now = Date.now();
    return now - eventTime < 24 * 60 * 60 * 1000;
  });

  const stats = {
    totalEvents: events.length,
    events24h: last24h.length,
    byEventType: {} as Record<string, number>,
    byPage: {} as Record<string, number>,
    uniquePages: new Set<string>(),
    timeline: [] as Array<{ date: string; count: number }>
  };

  // Count by event type and page
  events.forEach(event => {
    stats.byEventType[event.eventType] = (stats.byEventType[event.eventType] || 0) + 1;
    stats.byPage[event.page] = (stats.byPage[event.page] || 0) + 1;
    stats.uniquePages.add(event.page);
  });

  // Create timeline (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  last7Days.forEach(date => {
    const count = events.filter(event => 
      event.timestamp.startsWith(date)
    ).length;
    stats.timeline.push({ date, count });
  });

  return stats;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { eventType, page, data } = req.body;
      
      if (!eventType || !page) {
        return res.status(400).json({
          success: false,
          error: 'Missing required fields: eventType, page'
        });
      }

      const events = readAnalytics();
      
      const newEvent: AnalyticsEvent = {
        timestamp: new Date().toISOString(),
        eventType,
        page,
        data,
        userAgent: req.headers['user-agent'],
        ip: req.headers['x-forwarded-for'] as string || req.socket.remoteAddress
      };

      events.push(newEvent);
      
      // Keep only last 10,000 events to prevent file from growing too large
      const trimmedEvents = events.slice(-10000);
      writeAnalytics(trimmedEvents);

      return res.status(200).json({
        success: true,
        message: 'Event tracked successfully',
        eventId: newEvent.timestamp
      });

    } catch (error) {
      console.error('Error tracking analytics event:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to track event'
      });
    }
  }

  if (req.method === 'GET') {
    try {
      const { period = '24h' } = req.query;
      const events = readAnalytics();
      const stats = getStats(events);

      return res.status(200).json({
        success: true,
        data: {
          summary: stats,
          recentEvents: events.slice(-50).reverse() // Last 50 events
        }
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to fetch analytics'
      });
    }
  }

  return res.status(405).json({
    success: false,
    error: 'Method not allowed'
  });
}