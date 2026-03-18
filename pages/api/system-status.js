// pages/api/system-status.js - System health and status endpoint
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  try {
    const status = {
      timestamp: new Date().toISOString(),
      system: 'iseeiape Neo Crypto Engine',
      version: '2.0.0',
      components: {}
    };

    // Check Wolf Pack system
    const wolfLiveFile = path.join(process.cwd(), 'data/wolf-live.json');
    const wolfAlertsFile = path.join(process.cwd(), 'data/wolf-alerts-latest.json');
    const wolfSummaryFile = path.join(process.cwd(), 'neo-crypto/data/wolf-pack-summary.json');
    
    status.components.wolfPack = {
      liveData: fs.existsSync(wolfLiveFile),
      dashboardData: fs.existsSync(wolfAlertsFile),
      summaryData: fs.existsSync(wolfSummaryFile),
      lastUpdated: null
    };

    if (fs.existsSync(wolfLiveFile)) {
      const stats = fs.statSync(wolfLiveFile);
      status.components.wolfPack.lastUpdated = stats.mtime.toISOString();
      status.components.wolfPack.ageMinutes = Math.floor((new Date() - stats.mtime) / (1000 * 60));
      
      try {
        const data = JSON.parse(fs.readFileSync(wolfLiveFile, 'utf8'));
        const alerts = data.alerts || data;
        status.components.wolfPack.alertCount = Array.isArray(alerts) ? alerts.length : 0;
      } catch (e) {
        status.components.wolfPack.alertCount = 0;
      }
    }

    // Check cron jobs
    const logsDir = path.join(process.cwd(), 'neo-crypto/logs');
    status.components.cronJobs = {
      logsDirectory: fs.existsSync(logsDir),
      recentJobs: []
    };

    if (fs.existsSync(logsDir)) {
      const logFiles = fs.readdirSync(logsDir)
        .filter(f => f.endsWith('.log'))
        .sort()
        .reverse()
        .slice(0, 5);

      status.components.cronJobs.recentJobs = logFiles.map(file => {
        const filePath = path.join(logsDir, file);
        const stats = fs.statSync(filePath);
        const jobName = file.split('-')[0];
        
        return {
          job: jobName,
          file,
          lastRun: stats.mtime.toISOString(),
          size: stats.size
        };
      });
    }

    // Check content generation
    const contentDir = path.join(process.cwd(), 'neo-crypto/outputs/enhanced-content');
    status.components.contentGeneration = {
      enabled: fs.existsSync(contentDir),
      recentContent: []
    };

    if (fs.existsSync(contentDir)) {
      const contentFiles = fs.readdirSync(contentDir)
        .filter(f => f.endsWith('.md'))
        .sort()
        .reverse()
        .slice(0, 3);

      status.components.contentGeneration.recentContent = contentFiles.map(file => {
        const filePath = path.join(contentDir, file);
        const stats = fs.statSync(filePath);
        
        return {
          file,
          generated: stats.mtime.toISOString(),
          type: file.includes('alert-analysis') ? 'alert-analysis' : 
                file.includes('trend-report') ? 'trend-report' : 'unknown'
        };
      });
    }

    // Calculate overall health
    const wolfPackHealthy = status.components.wolfPack.ageMinutes < 30; // Updated in last 30 minutes
    const cronJobsHealthy = status.components.cronJobs.recentJobs.length > 0;
    
    status.health = {
      overall: wolfPackHealthy && cronJobsHealthy ? 'healthy' : 'degraded',
      wolfPack: wolfPackHealthy ? 'healthy' : 'degraded',
      cronJobs: cronJobsHealthy ? 'healthy' : 'degraded',
      details: []
    };

    if (!wolfPackHealthy) {
      status.health.details.push(`Wolf Pack data is ${status.components.wolfPack.ageMinutes || 'unknown'} minutes old`);
    }

    if (!cronJobsHealthy) {
      status.health.details.push('No recent cron job executions found');
    }

    // Add recommendations
    status.recommendations = [];
    
    if (status.components.wolfPack.ageMinutes > 60) {
      status.recommendations.push('Wolf Pack data is stale. Check cron job execution.');
    }
    
    if (status.components.cronJobs.recentJobs.length === 0) {
      status.recommendations.push('No cron jobs have run recently. Check cron manager setup.');
    }

    // Set cache headers (5 seconds for status)
    res.setHeader('Cache-Control', 's-maxage=5, stale-while-revalidate');
    res.status(200).json(status);
    
  } catch (error) {
    console.error('Error generating system status:', error);
    res.status(500).json({
      error: 'Failed to generate system status',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}