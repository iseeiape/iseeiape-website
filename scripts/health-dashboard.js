#!/usr/bin/env node

/**
 * Health Dashboard for iseeiape-website
 * 
 * Monitors system health, performance, and alerts.
 * Provides real-time insights and notifications.
 */

const fs = require('fs').promises;
const fsSync = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execPromise = promisify(exec);

// Configuration
const CONFIG = {
  logsDir: path.join(__dirname, '../neo-crypto/logs'),
  dataDir: path.join(__dirname, '../neo-crypto/data'),
  outputDir: path.join(__dirname, '../neo-crypto/outputs/health'),
  dashboardFile: path.join(__dirname, '../neo-crypto/outputs/health/dashboard.json'),
  
  // Monitoring thresholds
  thresholds: {
    wolfPackExecution: 8000, // ms
    errorRate: 0.05, // 5%
    cacheHitRate: 0.7, // 70%
    diskUsage: 0.8, // 80%
    memoryUsage: 0.8, // 80%
  },
  
  // Alert levels
  alertLevels: {
    critical: ['❌', 'CRITICAL'],
    warning: ['⚠️', 'WARNING'],
    info: ['ℹ️', 'INFO'],
    success: ['✅', 'SUCCESS']
  }
};

// Ensure directories exist
function ensureDirectories() {
  const dirs = [CONFIG.outputDir];
  dirs.forEach(dir => {
    if (!fsSync.existsSync(dir)) {
      fsSync.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });
}

// System health check
async function checkSystemHealth() {
  console.log('🔍 Checking system health...');
  
  const health = {
    timestamp: new Date().toISOString(),
    checks: {},
    alerts: [],
    summary: {
      status: 'healthy',
      critical: 0,
      warnings: 0,
      passed: 0
    }
  };
  
  // Check 1: Disk space
  try {
    const { stdout } = await execPromise('df -h / | tail -1');
    // df output: Filesystem Size Used Avail Use% Mounted-on
    const parts = stdout.trim().split(/\s+/);
    if (parts.length >= 6) {
      const [filesystem, size, used, available, percent, mount] = parts;
      const usage = parseFloat(percent.replace('%', '')) / 100;
      
      health.checks.disk = {
        status: usage < CONFIG.thresholds.diskUsage ? 'healthy' : 'warning',
        usage: usage,
        used: used,
        available: available,
        total: size,
        filesystem: filesystem,
        mount: mount
      };
      
      if (usage > CONFIG.thresholds.diskUsage) {
        health.alerts.push({
          level: 'warning',
          message: `Disk usage high: ${percent} used`,
          component: 'system',
          suggestion: 'Clean up old logs and cache files'
        });
        health.summary.warnings++;
      } else {
        health.summary.passed++;
      }
    } else {
      throw new Error(`Unexpected df output format: ${stdout}`);
    }
  } catch (error) {
    health.checks.disk = { status: 'error', error: error.message };
    health.summary.warnings++;
  }
  
  // Check 2: Memory usage
  try {
    const { stdout } = await execPromise('free -m | grep Mem:');
    const [, total, used] = stdout.match(/Mem:\s+(\d+)\s+(\d+)/);
    const usage = used / total;
    
    health.checks.memory = {
      status: usage < CONFIG.thresholds.memoryUsage ? 'healthy' : 'warning',
      usage: usage,
      used: `${used} MB`,
      total: `${total} MB`,
      free: `${total - used} MB`
    };
    
    if (usage > CONFIG.thresholds.memoryUsage) {
      health.alerts.push({
        level: 'warning',
        message: `Memory usage high: ${Math.round(usage * 100)}%`,
        component: 'system',
        suggestion: 'Check for memory leaks in running processes'
      });
      health.summary.warnings++;
    } else {
      health.summary.passed++;
    }
  } catch (error) {
    health.checks.memory = { status: 'error', error: error.message };
    health.summary.warnings++;
  }
  
  // Check 3: Process status
  try {
    const processes = [
      { name: 'node', pattern: 'node.*wolf-pack' },
      { name: 'python', pattern: 'python.*wolf_pack' }
    ];
    
    health.checks.processes = {};
    
    for (const proc of processes) {
      const { stdout } = await execPromise(`ps aux | grep -E "${proc.pattern}" | grep -v grep | wc -l`);
      const count = parseInt(stdout.trim());
      
      health.checks.processes[proc.name] = {
        status: count > 0 ? 'running' : 'stopped',
        count: count
      };
      
      if (count === 0 && proc.name === 'node') {
        health.alerts.push({
          level: 'warning',
          message: `${proc.name} process not running`,
          component: 'automation',
          suggestion: 'Check cron jobs and restart if needed'
        });
        health.summary.warnings++;
      } else {
        health.summary.passed++;
      }
    }
  } catch (error) {
    health.checks.processes = { status: 'error', error: error.message };
    health.summary.warnings++;
  }
  
  // Update summary status
  if (health.summary.critical > 0) {
    health.summary.status = 'critical';
  } else if (health.summary.warnings > 0) {
    health.summary.status = 'warning';
  } else {
    health.summary.status = 'healthy';
  }
  
  return health;
}

// Wolf Pack performance check
async function checkWolfPackPerformance() {
  console.log('🔍 Checking Wolf Pack performance...');
  
  const performance = {
    timestamp: new Date().toISOString(),
    metrics: {},
    alerts: [],
    summary: {
      status: 'healthy',
      lastRun: null,
      avgExecutionTime: 0
    }
  };
  
  try {
    // Get recent performance logs
    const performanceLog = path.join(CONFIG.logsDir, 'performance-wolf-pack.log');
    if (fsSync.existsSync(performanceLog)) {
      const content = await fs.readFile(performanceLog, 'utf8');
      const lines = content.trim().split('\n');
      
      if (lines.length > 0) {
        const lastLine = JSON.parse(lines[lines.length - 1]);
        performance.summary.lastRun = lastLine.timestamp;
        performance.summary.avgExecutionTime = lastLine.totalDuration || 0;
        
        performance.metrics.lastRun = {
          executionTime: lastLine.totalDuration,
          success: lastLine.success,
          errors: lastLine.errors?.length || 0
        };
        
        // Check for performance issues
        if (lastLine.totalDuration > CONFIG.thresholds.wolfPackExecution) {
          performance.alerts.push({
            level: 'warning',
            message: `Wolf Pack execution slow: ${lastLine.totalDuration}ms`,
            component: 'wolf-pack',
            suggestion: 'Optimize Python script or implement caching'
          });
        }
        
        if (!lastLine.success) {
          performance.alerts.push({
            level: 'critical',
            message: 'Last Wolf Pack run failed',
            component: 'wolf-pack',
            suggestion: 'Check error logs and fix issues'
          });
        }
      }
    }
    
    // Check cache files
    const cacheFiles = ['wolf-pack-cache.json', 'wolf-pack-summary.json'];
    for (const file of cacheFiles) {
      const filePath = path.join(CONFIG.dataDir, file);
      if (fsSync.existsSync(filePath)) {
        const stats = fsSync.statSync(filePath);
        const age = Date.now() - stats.mtimeMs;
        
        performance.metrics[file] = {
          exists: true,
          size: stats.size,
          age: age,
          lastModified: stats.mtime.toISOString()
        };
        
        // Check if cache is stale (> 1 hour)
        if (age > 60 * 60 * 1000) {
          performance.alerts.push({
            level: 'warning',
            message: `${file} cache is stale (${Math.round(age / 1000 / 60)} minutes old)`,
            component: 'cache',
            suggestion: 'Check if Wolf Pack cron job is running'
          });
        }
      } else {
        performance.metrics[file] = { exists: false };
        performance.alerts.push({
          level: 'warning',
          message: `${file} not found`,
          component: 'cache',
          suggestion: 'Wolf Pack may not be running properly'
        });
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking Wolf Pack performance:', error.message);
    performance.metrics.error = error.message;
  }
  
  return performance;
}

// Error rate analysis
async function checkErrorRates() {
  console.log('🔍 Checking error rates...');
  
  const errors = {
    timestamp: new Date().toISOString(),
    recentErrors: [],
    errorRate: 0,
    alerts: [],
    summary: {
      totalErrors: 0,
      errorRate: 0,
      status: 'healthy'
    }
  };
  
  try {
    // Get recent log files
    const logFiles = fsSync.readdirSync(CONFIG.logsDir)
      .filter(file => file.endsWith('.log'))
      .sort()
      .slice(-10); // Last 10 logs
    
    let totalLines = 0;
    let errorLines = 0;
    
    for (const logFile of logFiles) {
      const logPath = path.join(CONFIG.logsDir, logFile);
      const content = await fs.readFile(logPath, 'utf8');
      const lines = content.split('\n');
      
      totalLines += lines.length;
      
      const fileErrors = lines.filter(line => 
        line.includes('❌') || 
        line.includes('Error:') || 
        line.includes('ERROR]')
      );
      
      errorLines += fileErrors.length;
      
      // Add recent errors
      if (fileErrors.length > 0) {
        errors.recentErrors.push({
          file: logFile,
          errors: fileErrors.slice(0, 3).map(e => e.substring(0, 200))
        });
      }
    }
    
    // Calculate error rate
    errors.summary.totalErrors = errorLines;
    errors.summary.errorRate = totalLines > 0 ? errorLines / totalLines : 0;
    errors.errorRate = errors.summary.errorRate;
    
    // Check threshold
    if (errors.summary.errorRate > CONFIG.thresholds.errorRate) {
      errors.alerts.push({
        level: 'warning',
        message: `High error rate: ${Math.round(errors.summary.errorRate * 100)}%`,
        component: 'system',
        suggestion: 'Review recent errors and fix root causes'
      });
      errors.summary.status = 'warning';
    }
    
  } catch (error) {
    console.error('❌ Error checking error rates:', error.message);
    errors.summary.error = error.message;
  }
  
  return errors;
}

// Generate dashboard
async function generateDashboard(health, performance, errors) {
  console.log('📊 Generating health dashboard...');
  
  const dashboard = {
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      source: 'health-dashboard'
    },
    status: {
      overall: 'healthy',
      components: {
        system: health.summary.status,
        wolfPack: performance.metrics.lastRun?.success ? 'healthy' : 'warning',
        errors: errors.summary.status
      }
    },
    health,
    performance,
    errors,
    recommendations: [],
    timestamp: new Date().toISOString()
  };
  
  // Determine overall status
  const statuses = [
    health.summary.status,
    performance.metrics.lastRun?.success ? 'healthy' : 'warning',
    errors.summary.status
  ];
  
  if (statuses.includes('critical')) {
    dashboard.status.overall = 'critical';
  } else if (statuses.includes('warning')) {
    dashboard.status.overall = 'warning';
  } else {
    dashboard.status.overall = 'healthy';
  }
  
  // Generate recommendations
  const allAlerts = [
    ...health.alerts,
    ...performance.alerts,
    ...errors.alerts
  ];
  
  dashboard.recommendations = allAlerts.map(alert => ({
    priority: alert.level === 'critical' ? 'high' : alert.level === 'warning' ? 'medium' : 'low',
    component: alert.component,
    issue: alert.message,
    suggestion: alert.suggestion
  }));
  
  // Save dashboard
  await fs.writeFile(
    CONFIG.dashboardFile,
    JSON.stringify(dashboard, null, 2),
    'utf8'
  );
  
  // Generate human-readable summary
  const summaryFile = path.join(CONFIG.outputDir, 'health-summary.txt');
  const summary = `
🚀 ISEEIAPE HEALTH DASHBOARD
============================
Generated: ${new Date().toISOString()}
Overall Status: ${dashboard.status.overall.toUpperCase()}

📊 SYSTEM HEALTH:
• Disk: ${health.checks.disk?.status || 'unknown'} (${health.checks.disk?.usage ? Math.round(health.checks.disk.usage * 100) : '?'}%)
• Memory: ${health.checks.memory?.status || 'unknown'} (${health.checks.memory?.usage ? Math.round(health.checks.memory.usage * 100) : '?'}%)
• Processes: ${Object.keys(health.checks.processes || {}).length} monitored

🐺 WOLF PACK:
• Last Run: ${performance.summary.lastRun || 'unknown'}
• Execution Time: ${performance.summary.avgExecutionTime || 0}ms
• Status: ${performance.metrics.lastRun?.success ? '✅' : '❌'}

❌ ERRORS:
• Recent Errors: ${errors.summary.totalErrors}
• Error Rate: ${Math.round(errors.summary.errorRate * 100)}%
• Status: ${errors.summary.status}

🚨 ALERTS: ${allAlerts.length}
${allAlerts.map(a => `  • ${a.level}: ${a.message}`).join('\n')}

🎯 RECOMMENDATIONS: ${dashboard.recommendations.length}
${dashboard.recommendations.slice(0, 3).map(r => `  • [${r.priority.toUpperCase()}] ${r.issue}`).join('\n')}
`;
  
  await fs.writeFile(summaryFile, summary, 'utf8');
  
  console.log(`💾 Dashboard saved: ${CONFIG.dashboardFile}`);
  console.log(`📝 Summary saved: ${summaryFile}`);
  
  return dashboard;
}

// Display dashboard
function displayDashboard(dashboard) {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 ISEEIAPE HEALTH DASHBOARD');
  console.log('='.repeat(60));
  
  // Overall status with emoji
  const statusEmoji = {
    healthy: '✅',
    warning: '⚠️',
    critical: '❌'
  };
  
  console.log(`Overall Status: ${statusEmoji[dashboard.status.overall]} ${dashboard.status.overall.toUpperCase()}`);
  console.log(`Generated: ${new Date(dashboard.timestamp).toLocaleString()}`);
  console.log();
  
  // System health
  console.log('📊 SYSTEM HEALTH:');
  console.log(`  Disk: ${dashboard.health.checks.disk?.status || 'unknown'} (${dashboard.health.checks.disk?.usage ? Math.round(dashboard.health.checks.disk.usage * 100) : '?'}% used)`);
  console.log(`  Memory: ${dashboard.health.checks.memory?.status || 'unknown'} (${dashboard.health.checks.memory?.usage ? Math.round(dashboard.health.checks.memory.usage * 100) : '?'}% used)`);
  
  if (dashboard.health.checks.processes) {
    Object.entries(dashboard.health.checks.processes).forEach(([name, proc]) => {
      console.log(`  ${name}: ${proc.status} (${proc.count} processes)`);
    });
  }
  console.log();
  
  // Wolf Pack
  console.log('🐺 WOLF PACK PERFORMANCE:');
  console.log(`  Last Run: ${dashboard.performance.summary.lastRun ? new Date(dashboard.performance.summary.lastRun).toLocaleString() : 'unknown'}`);
  console.log(`  Execution Time: ${dashboard.performance.summary.avgExecutionTime || 0}ms`);
  console.log(`  Status: ${dashboard.performance.metrics.lastRun?.success ? '✅ Success' : '❌ Failed'}`);
  console.log();
  
  // Errors
  console.log('❌ ERROR ANALYSIS:');
  console.log(`  Recent Errors: ${dashboard.errors.summary.totalErrors}`);
  console.log(`  Error Rate: ${Math.round(dashboard.errors.summary.errorRate * 100)}%`);
  console.log();
  
  // Alerts
  if (dashboard.recommendations.length > 0) {
    console.log('🚨 ACTIVE ALERTS:');
    dashboard.recommendations.slice(0, 5).forEach(rec => {
      const emoji = rec.priority === 'high' ? '❌' : rec.priority === 'medium' ? '⚠️' : 'ℹ️';
      console.log(`  ${emoji} [${rec.priority.toUpperCase()}] ${rec.issue}`);
    });
    console.log();
  }
  
  console.log('='.repeat(60));
  console.log(`📋 Full dashboard: ${CONFIG.dashboardFile}`);
  console.log(`📝 Summary: ${path.join(CONFIG.outputDir, 'health-summary.txt')}`);
  console.log('='.repeat(60));
}

// Main execution
async function main() {
  console.log('🏥 Health Dashboard for iseeiape-website');
  console.log('='.repeat(50));
  
  ensureDirectories();
  
  try {
    // Run all checks
    const health = await checkSystemHealth();
    const performance = await checkWolfPackPerformance();
    const errors = await checkErrorRates();
    
    // Generate and display dashboard
    const dashboard = await generateDashboard(health, performance, errors);
    displayDashboard(dashboard);
    
    // Return exit code based on status
    if (dashboard.status.overall === 'critical') {
      console.error('❌ Health check failed with critical issues');
      return { success: false, status: 'critical', dashboard };
    } else if (dashboard.status.overall === 'warning') {
      console.warn('⚠️  Health check completed with warnings');
      return { success: true, status: 'warning', dashboard };
    } else {
      console.log('✅ Health check passed successfully');
      return { success: true, status: 'healthy', dashboard };
    }
    
  } catch (error) {
    console.error('❌ Health dashboard failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run if called directly
if (require.main === module) {
  main().then(result => {
    if (!result.success) {
      process.exit(1);
    }
  }).catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  checkSystemHealth,
  checkWolfPackPerformance,
  checkErrorRates,
  generateDashboard,
  displayDashboard,
  main
};