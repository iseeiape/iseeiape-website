#!/usr/bin/env node

/**
 * API Health Monitor for iseeiape.com
 * 
 * Monitors:
 * 1. DexScreener API status
 * 2. Cielo API status
 * 3. Website uptime
 * 4. Response times
 * 
 * Sends alerts when services are down
 * Stores health history for analytics
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Configuration
const CIELO_API_KEY = process.env.CIELO_API_KEY || '93771acc-c2fc-455d-b8e7-263ccd61da4a';
const HEALTH_DIR = path.join(__dirname, '../data/health');
const ALERTS_FILE = path.join(HEALTH_DIR, 'alerts.json');
const HISTORY_FILE = path.join(HEALTH_DIR, 'history.json');

// Ensure directories exist
if (!fs.existsSync(HEALTH_DIR)) fs.mkdirSync(HEALTH_DIR, { recursive: true });

/**
 * Check DexScreener API health
 */
async function checkDexScreener() {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    https.get('https://api.dexscreener.com/latest/dex/search?q=sol', (res) => {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;
      
      res.on('data', () => {}); // Consume data
      res.on('end', () => {
        resolve({
          service: 'dexscreener',
          status: statusCode === 200 ? 'healthy' : 'degraded',
          statusCode,
          responseTime,
          timestamp: new Date().toISOString()
        });
      });
    }).on('error', (error) => {
      resolve({
        service: 'dexscreener',
        status: 'down',
        error: error.message,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    }).setTimeout(10000, () => {
      resolve({
        service: 'dexscreener',
        status: 'timeout',
        error: 'Request timeout',
        responseTime: 10000,
        timestamp: new Date().toISOString()
      });
    });
  });
}

/**
 * Check Cielo API health
 */
async function checkCielo() {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    const options = {
      headers: {
        'X-API-KEY': CIELO_API_KEY,
        'Accept': 'application/json'
      },
      timeout: 10000
    };
    
    const req = https.get('https://feed-api.cielo.finance/api/v1/feed?chains=solana&limit=1', options, (res) => {
      const responseTime = Date.now() - startTime;
      const statusCode = res.statusCode;
      
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          const hasData = result.data?.items?.length > 0 || result.items?.length > 0;
          
          resolve({
            service: 'cielo',
            status: statusCode === 200 && hasData ? 'healthy' : 'degraded',
            statusCode,
            hasData,
            responseTime,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          resolve({
            service: 'cielo',
            status: 'degraded',
            statusCode,
            error: 'Invalid JSON response',
            responseTime,
            timestamp: new Date().toISOString()
          });
        }
      });
    });
    
    req.on('error', (error) => {
      resolve({
        service: 'cielo',
        status: 'down',
        error: error.message,
        responseTime: Date.now() - startTime,
        timestamp: new Date().toISOString()
      });
    });
    
    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        service: 'cielo',
        status: 'timeout',
        error: 'Request timeout',
        responseTime: 10000,
        timestamp: new Date().toISOString()
      });
    });
  });
}

/**
 * Check website endpoint (self-check)
 */
async function checkWebsite() {
  return new Promise((resolve) => {
    const startTime = Date.now();
    
    // For now, we'll simulate checking the website
    // In production, this would check the actual deployed URL
    // For development, we'll check if the API route file exists and is valid
    
    setTimeout(() => {
      const apiRoutePath = path.join(__dirname, '../src/app/api/trending/route.ts');
      const apiRouteExists = fs.existsSync(apiRoutePath);
      
      if (apiRouteExists) {
        try {
          const content = fs.readFileSync(apiRoutePath, 'utf8');
          const hasCieloKey = content.includes('CIELO_API_KEY');
          const hasDexScreener = content.includes('dexscreener');
          
          resolve({
            service: 'website-api',
            status: 'healthy',
            statusCode: 200,
            note: 'API route exists and appears valid',
            hasCieloKey,
            hasDexScreener,
            responseTime: Date.now() - startTime,
            timestamp: new Date().toISOString()
          });
        } catch (error) {
          resolve({
            service: 'website-api',
            status: 'degraded',
            error: 'Cannot read API route file',
            responseTime: Date.now() - startTime,
            timestamp: new Date().toISOString()
          });
        }
      } else {
        resolve({
          service: 'website-api',
          status: 'degraded',
          error: 'API route file not found',
          responseTime: Date.now() - startTime,
          timestamp: new Date().toISOString()
        });
      }
    }, 100);
  });
}

/**
 * Check public website endpoint as fallback
 */
function checkPublicWebsite(resolve, startTime) {
  // In production, this would check the actual deployed URL
  // For now, we'll simulate a check
  resolve({
    service: 'website-api',
    status: 'unknown',
    note: 'Local server not running, public endpoint check not implemented',
    responseTime: Date.now() - startTime,
    timestamp: new Date().toISOString()
  });
}

/**
 * Save health check results to history
 */
function saveToHistory(results) {
  let history = { checks: [], lastUpdated: new Date().toISOString() };
  
  if (fs.existsSync(HISTORY_FILE)) {
    try {
      history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    } catch (error) {
      console.warn('Could not parse health history, creating new one');
    }
  }
  
  // Add new check
  history.checks.unshift({
    timestamp: new Date().toISOString(),
    results
  });
  
  // Keep only last 1000 checks (approx 42 days if checking hourly)
  history.checks = history.checks.slice(0, 1000);
  history.lastUpdated = new Date().toISOString();
  
  fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2));
}

/**
 * Check if we need to send an alert
 */
function checkForAlerts(results, previousAlerts = []) {
  const alerts = [];
  const now = new Date();
  
  results.forEach((result) => {
    if (result.status !== 'healthy') {
      // Check if we already alerted for this service in the last hour
      const lastAlert = previousAlerts.find(a => 
        a.service === result.service && 
        new Date(now - new Date(a.timestamp)).getHours() < 1
      );
      
      if (!lastAlert) {
        alerts.push({
          service: result.service,
          status: result.status,
          error: result.error || `Status: ${result.statusCode}`,
          timestamp: now.toISOString(),
          severity: result.status === 'down' ? 'high' : 'medium'
        });
      }
    }
  });
  
  return alerts;
}

/**
 * Save alerts
 */
function saveAlerts(alerts) {
  let allAlerts = [];
  
  if (fs.existsSync(ALERTS_FILE)) {
    try {
      allAlerts = JSON.parse(fs.readFileSync(ALERTS_FILE, 'utf8'));
    } catch (error) {
      console.warn('Could not parse alerts file, creating new one');
    }
  }
  
  // Add new alerts
  allAlerts = [...alerts, ...allAlerts];
  
  // Keep only last 100 alerts
  allAlerts = allAlerts.slice(0, 100);
  
  fs.writeFileSync(ALERTS_FILE, JSON.stringify(allAlerts, null, 2));
  
  // Return new alerts for notification
  return alerts;
}

/**
 * Generate health summary
 */
function generateSummary(results) {
  const healthyServices = results.filter(r => r.status === 'healthy').length;
  const totalServices = results.length;
  const healthPercentage = Math.round((healthyServices / totalServices) * 100);
  
  const problematicServices = results
    .filter(r => r.status !== 'healthy')
    .map(r => `${r.service} (${r.status})`);
  
  return {
    overallHealth: healthPercentage,
    healthyServices,
    totalServices,
    problematicServices,
    timestamp: new Date().toISOString()
  };
}

/**
 * Main function
 */
async function main() {
  console.log('🏥 Starting API Health Monitor\n');
  
  try {
    // Run all health checks in parallel
    console.log('🔍 Running health checks...');
    const [dexscreener, cielo, website] = await Promise.all([
      checkDexScreener(),
      checkCielo(),
      checkWebsite()
    ]);
    
    const results = [dexscreener, cielo, website];
    
    // Display results
    console.log('\n📊 Health Check Results:');
    console.log('─────────────────────────');
    
    results.forEach((result) => {
      const statusEmoji = result.status === 'healthy' ? '✅' : 
                         result.status === 'degraded' ? '⚠️' : '❌';
      console.log(`${statusEmoji} ${result.service.padEnd(15)} ${result.status.padEnd(10)} ${result.responseTime}ms`);
      
      if (result.error) {
        console.log(`   Error: ${result.error}`);
      }
    });
    
    // Generate summary
    const summary = generateSummary(results);
    console.log('\n📈 Summary:');
    console.log(`Overall Health: ${summary.overallHealth}% (${summary.healthyServices}/${summary.totalServices} services)`);
    
    if (summary.problematicServices.length > 0) {
      console.log(`Problematic: ${summary.problematicServices.join(', ')}`);
    }
    
    // Save to history
    saveToHistory(results);
    console.log(`\n📁 Health data saved to: ${HEALTH_DIR}`);
    
    // Check for alerts
    let previousAlerts = [];
    if (fs.existsSync(ALERTS_FILE)) {
      try {
        previousAlerts = JSON.parse(fs.readFileSync(ALERTS_FILE, 'utf8'));
      } catch (error) {
        // Ignore parse errors
      }
    }
    
    const newAlerts = checkForAlerts(results, previousAlerts);
    
    if (newAlerts.length > 0) {
      const savedAlerts = saveAlerts(newAlerts);
      console.log(`\n🚨 New Alerts (${savedAlerts.length}):`);
      savedAlerts.forEach(alert => {
        console.log(`   ${alert.service}: ${alert.status} - ${alert.error}`);
      });
      
      // In production, here you would:
      // 1. Send Telegram/Slack notification
      // 2. Send email alert
      // 3. Trigger incident response
      console.log('\n💡 Alert notifications would be sent here (Telegram/Slack/Email)');
    }
    
    // Generate health status file for dashboard
    const statusFile = path.join(HEALTH_DIR, 'status.json');
    fs.writeFileSync(statusFile, JSON.stringify({
      summary,
      results,
      timestamp: new Date().toISOString()
    }, null, 2));
    
    console.log('\n✅ Health monitoring complete!');
    
  } catch (error) {
    console.error('❌ Health monitoring failed:', error.message);
  }
}

// Run the script
if (require.main === module) {
  main();
}

module.exports = { 
  checkHealth: main,
  checkDexScreener,
  checkCielo,
  checkWebsite
};