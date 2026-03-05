#!/usr/bin/env node

/**
 * Cron Job Monitor for Matrix Army Automation System
 * 
 * Monitors all cron jobs, checks for failures, and sends alerts
 * Runs every 15 minutes via cron
 */

const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

// Configuration
const CONFIG = {
  logDir: '/home/matrix/.openclaw/workspace/iseeiape-website/content/automation/logs',
  alertLog: '/home/matrix/.openclaw/workspace/iseeiape-website/content/automation/logs/alerts.log',
  maxLogAgeMinutes: {
    wolf: 45,      // Wolf alerts run every 30 min, allow 15 min buffer
    trends: 45,    // Trend tracker runs every 30 min
    telegram: 20,  // Telegram alerts run every 30 min at :05/:35
    data: 10       // Data fetcher runs every 5 min
  },
  checkIntervalMinutes: 15
};

// Cron jobs to monitor
const CRON_JOBS = [
  {
    name: 'wolf_alerts',
    description: 'Wolf Alerts v4.2 (DexScreener)',
    logFile: '/tmp/wolf.log',
    command: 'wolf_alerts_v4_2_dexscreener.py',
    schedule: '*/30 * * * *',
    critical: true
  },
  {
    name: 'trend_tracker',
    description: 'Trend Tracker (Reddit + Hacker News)',
    logFile: '/tmp/trends.log',
    command: 'legionare_trend_tracker.py',
    schedule: '*/30 * * * *',
    critical: true
  },
  {
    name: 'telegram_alerts',
    description: 'Telegram Alerts',
    logFile: '/tmp/telegram_alerts.log',
    command: 'wolf_telegram_alerts.py',
    schedule: '5,35 * * * *',
    critical: true
  },
  {
    name: 'data_fetcher',
    description: 'Real-time Data Fetcher',
    logFile: '/home/matrix/.openclaw/workspace/iseeiape-website/content/automation/logs/data-fetcher.log',
    command: 'real-time-data-fetcher.js',
    schedule: '*/5 * * * *',
    critical: true
  },
  {
    name: 'content_scheduler',
    description: 'Content Scheduler',
    logFile: '/home/matrix/.openclaw/workspace/iseeiape-website/content/automation/logs/content-scheduler.log',
    command: 'enhanced-content-scheduler.js',
    schedule: '0 * * * *', // Every hour
    critical: false
  }
];

class CronMonitor {
  constructor() {
    this.status = {
      timestamp: new Date().toISOString(),
      jobs: {},
      alerts: [],
      systemHealth: 'healthy'
    };
  }

  async monitor() {
    console.log(`🕐 Cron Monitor started at ${new Date().toLocaleString()}`);
    console.log('='.repeat(60));
    
    // Check each cron job
    for (const job of CRON_JOBS) {
      await this.checkJob(job);
    }
    
    // Check system resources
    await this.checkSystemResources();
    
    // Generate report
    await this.generateReport();
    
    // Send alerts if needed
    if (this.status.alerts.length > 0) {
      await this.sendAlerts();
    }
    
    console.log('='.repeat(60));
    console.log(`✅ Cron Monitor completed. Status: ${this.status.systemHealth}`);
    
    // Save status for dashboard
    await this.saveStatus();
  }

  async checkJob(job) {
    const jobStatus = {
      name: job.name,
      description: job.description,
      status: 'unknown',
      lastRun: null,
      ageMinutes: null,
      logSize: 0,
      errorCount: 0,
      details: ''
    };

    try {
      // Check if log file exists
      try {
        const stats = await fs.stat(job.logFile);
        jobStatus.logSize = stats.size;
        jobStatus.lastRun = stats.mtime;
        
        const ageMs = Date.now() - stats.mtimeMs;
        jobStatus.ageMinutes = Math.floor(ageMs / 60000);
        
        // Check if log is too old
        const maxAge = CONFIG.maxLogAgeMinutes[job.name] || 60;
        if (jobStatus.ageMinutes > maxAge) {
          jobStatus.status = 'stale';
          jobStatus.details = `Log not updated for ${jobStatus.ageMinutes} minutes (max: ${maxAge} min)`;
          
          if (job.critical) {
            this.status.alerts.push({
              type: 'stale_job',
              job: job.name,
              severity: 'high',
              message: `${job.description} has not run in ${jobStatus.ageMinutes} minutes`,
              timestamp: new Date().toISOString()
            });
          }
        } else {
          jobStatus.status = 'healthy';
          jobStatus.details = `Last run ${jobStatus.ageMinutes} minutes ago`;
        }
        
        // Check log for errors
        const logContent = await fs.readFile(job.logFile, 'utf8');
        const lines = logContent.split('\n').filter(line => line.trim());
        
        // Look for error indicators
        const errorLines = lines.filter(line => 
          line.toLowerCase().includes('error') ||
          line.toLowerCase().includes('failed') ||
          line.toLowerCase().includes('exception') ||
          line.includes('Traceback')
        );
        
        jobStatus.errorCount = errorLines.length;
        
        if (errorLines.length > 0) {
          jobStatus.status = 'error';
          jobStatus.details = `Found ${errorLines.length} error(s) in log`;
          
          this.status.alerts.push({
            type: 'job_error',
            job: job.name,
            severity: job.critical ? 'high' : 'medium',
            message: `${job.description} has ${errorLines.length} error(s)`,
            timestamp: new Date().toISOString(),
            sampleError: errorLines[0]?.substring(0, 200) // First 200 chars of first error
          });
        }
        
      } catch (error) {
        if (error.code === 'ENOENT') {
          jobStatus.status = 'missing_log';
          jobStatus.details = 'Log file not found';
          
          if (job.critical) {
            this.status.alerts.push({
              type: 'missing_log',
              job: job.name,
              severity: 'medium',
              message: `${job.description} log file not found`,
              timestamp: new Date().toISOString()
            });
          }
        } else {
          jobStatus.status = 'check_error';
          jobStatus.details = `Error checking log: ${error.message}`;
        }
      }
      
      // Check if process is running
      try {
        const { stdout } = await execPromise(`pgrep -f "${job.command}"`);
        if (stdout.trim()) {
          jobStatus.processRunning = true;
          const pids = stdout.trim().split('\n');
          jobStatus.details += ` | Process running (PID: ${pids[0]})`;
        } else {
          jobStatus.processRunning = false;
          if (jobStatus.ageMinutes > 5 && job.critical) {
            jobStatus.status = 'no_process';
            jobStatus.details += ' | No process found';
          }
        }
      } catch (pgrepError) {
        // pgrep returns non-zero when no processes found
        jobStatus.processRunning = false;
      }
      
    } catch (error) {
      jobStatus.status = 'check_failed';
      jobStatus.details = `Check failed: ${error.message}`;
      console.error(`Error checking job ${job.name}:`, error);
    }
    
    this.status.jobs[job.name] = jobStatus;
    
    // Display status
    const statusIcon = {
      healthy: '✅',
      stale: '⚠️',
      error: '❌',
      missing_log: '📄',
      no_process: '🔍',
      check_error: '❓',
      check_failed: '💥',
      unknown: '❓'
    }[jobStatus.status] || '❓';
    
    console.log(`${statusIcon} ${job.description}`);
    console.log(`   Status: ${jobStatus.status} | Age: ${jobStatus.ageMinutes || 'N/A'} min | Errors: ${jobStatus.errorCount}`);
    console.log(`   Details: ${jobStatus.details}`);
    console.log('');
  }

  async checkSystemResources() {
    try {
      // Check disk space
      const { stdout: diskStdout } = await execPromise("df -h /home/matrix/.openclaw/workspace | tail -1 | awk '{print $5}'");
      const diskUsage = diskStdout.trim();
      
      // Check memory
      const { stdout: memStdout } = await execPromise("free -m | awk 'NR==2{printf \"%.1f%%\", $3*100/$2}'");
      const memUsage = memStdout.trim();
      
      // Check CPU load
      const { stdout: cpuStdout } = await execPromise("uptime | awk -F'load average:' '{print $2}' | awk '{print $1}'");
      const cpuLoad = cpuStdout.trim();
      
      this.status.systemResources = {
        diskUsage,
        memUsage,
        cpuLoad,
        timestamp: new Date().toISOString()
      };
      
      // Check for resource issues
      const diskPercent = parseInt(diskUsage);
      if (diskPercent > 90) {
        this.status.alerts.push({
          type: 'high_disk_usage',
          severity: 'high',
          message: `Disk usage is ${diskUsage} (above 90%)`,
          timestamp: new Date().toISOString()
        });
      }
      
      const memPercent = parseFloat(memUsage);
      if (memPercent > 90) {
        this.status.alerts.push({
          type: 'high_memory_usage',
          severity: 'high',
          message: `Memory usage is ${memUsage} (above 90%)`,
          timestamp: new Date().toISOString()
        });
      }
      
      const cpuLoadNum = parseFloat(cpuLoad);
      if (cpuLoadNum > 5.0) {
        this.status.alerts.push({
          type: 'high_cpu_load',
          severity: 'medium',
          message: `CPU load is ${cpuLoad} (above 5.0)`,
          timestamp: new Date().toISOString()
        });
      }
      
      console.log('💻 System Resources:');
      console.log(`   Disk: ${diskUsage} | Memory: ${memUsage} | CPU Load: ${cpuLoad}`);
      
    } catch (error) {
      console.error('Error checking system resources:', error);
      this.status.systemResources = {
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }

  async generateReport() {
    const healthyJobs = Object.values(this.status.jobs).filter(j => j.status === 'healthy').length;
    const totalJobs = Object.keys(this.status.jobs).length;
    
    if (this.status.alerts.length > 0) {
      this.status.systemHealth = 'issues';
      console.log(`\n🚨 ALERTS (${this.status.alerts.length}):`);
      this.status.alerts.forEach(alert => {
        const severityIcon = {
          high: '🔴',
          medium: '🟡',
          low: '🔵'
        }[alert.severity] || '⚪';
        
        console.log(`${severityIcon} [${alert.type.toUpperCase()}] ${alert.message}`);
        if (alert.sampleError) {
          console.log(`   Sample: ${alert.sampleError}`);
        }
      });
    } else {
      this.status.systemHealth = 'healthy';
      console.log(`\n✅ All systems operational (${healthyJobs}/${totalJobs} jobs healthy)`);
    }
    
    // Update overall status based on critical jobs
    const criticalJobs = CRON_JOBS.filter(j => j.critical);
    const failedCriticalJobs = criticalJobs.filter(j => 
      this.status.jobs[j.name]?.status !== 'healthy'
    );
    
    if (failedCriticalJobs.length > 0) {
      this.status.systemHealth = 'critical';
      console.log(`\n🔴 CRITICAL: ${failedCriticalJobs.length} critical job(s) failed`);
    }
  }

  async sendAlerts() {
    // For now, just log alerts. In production, this would:
    // 1. Send Telegram message
    // 2. Send email alert
    // 3. Create dashboard notification
    
    const alertLog = {
      timestamp: new Date().toISOString(),
      monitorRun: this.status.timestamp,
      alerts: this.status.alerts,
      summary: {
        totalAlerts: this.status.alerts.length,
        highSeverity: this.status.alerts.filter(a => a.severity === 'high').length,
        mediumSeverity: this.status.alerts.filter(a => a.severity === 'medium').length
      }
    };
    
    try {
      // Ensure log directory exists
      await fs.mkdir(path.dirname(CONFIG.alertLog), { recursive: true });
      
      // Append to alert log
      await fs.appendFile(CONFIG.alertLog, JSON.stringify(alertLog, null, 2) + '\n---\n');
      
      console.log(`\n📝 Alerts logged to: ${CONFIG.alertLog}`);
      
      // TODO: Implement Telegram alerting
      // if (this.status.alerts.filter(a => a.severity === 'high').length > 0) {
      //   await this.sendTelegramAlert(alertLog);
      // }
      
    } catch (error) {
      console.error('Error logging alerts:', error);
    }
  }

  async saveStatus() {
    try {
      const statusFile = path.join(CONFIG.logDir, 'cron-monitor-status.json');
      await fs.writeFile(statusFile, JSON.stringify(this.status, null, 2));
      
      // Also save to a public location for dashboard
      const publicStatusFile = path.join(
        '/home/matrix/.openclaw/workspace/iseeiape-website/content/automation',
        'public-status.json'
      );
      
      // Create public version without sensitive info
      const publicStatus = {
        timestamp: this.status.timestamp,
        systemHealth: this.status.systemHealth,
        jobSummary: Object.entries(this.status.jobs).reduce((acc, [name, job]) => {
          acc[name] = {
            status: job.status,
            ageMinutes: job.ageMinutes,
            errorCount: job.errorCount
          };
          return acc;
        }, {}),
        alertCount: this.status.alerts.length,
        systemResources: this.status.systemResources
      };
      
      await fs.writeFile(publicStatusFile, JSON.stringify(publicStatus, null, 2));
      
    } catch (error) {
      console.error('Error saving status:', error);
    }
  }
}

// Run monitor
async function main() {
  const monitor = new CronMonitor();
  
  try {
    await monitor.monitor();
    
    // Exit with appropriate code
    if (monitor.status.systemHealth === 'critical') {
      process.exit(2);
    } else if (monitor.status.systemHealth === 'issues') {
      process.exit(1);
    } else {
      process.exit(0);
    }
    
  } catch (error) {
    console.error('Monitor failed:', error);
    process.exit(3);
  }
}

// Handle command line arguments
if (require.main === module) {
  main();
}

module.exports = { CronMonitor, CRON_JOBS };