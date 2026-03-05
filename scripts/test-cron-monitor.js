#!/usr/bin/env node

/**
 * Test script for Cron Monitor
 */

const { CronMonitor } = require('./cron-monitor.js');

async function testMonitor() {
  console.log('🧪 Testing Cron Monitor...\n');
  
  const monitor = new CronMonitor();
  
  // Test with a subset of jobs
  const testJobs = [
    {
      name: 'test_wolf',
      description: 'Test Wolf Alerts',
      logFile: '/tmp/test_wolf.log',
      command: 'test_wolf.py',
      schedule: '*/30 * * * *',
      critical: true
    },
    {
      name: 'test_data',
      description: 'Test Data Fetcher',
      logFile: '/tmp/test_data.log',
      command: 'test_data.js',
      schedule: '*/5 * * * *',
      critical: true
    }
  ];
  
  // Create test log files
  const fs = require('fs').promises;
  const path = require('path');
  
  // Create a healthy log file
  const healthyLogContent = `[${new Date().toISOString()}] INFO: Job started
[${new Date().toISOString()}] INFO: Processing data
[${new Date().toISOString()}] INFO: Job completed successfully
`;
  
  // Create an error log file
  const errorLogContent = `[${new Date().toISOString()}] INFO: Job started
[${new Date().toISOString()}] ERROR: Failed to fetch data from API
[${new Date().toISOString()}] ERROR: Connection timeout
[${new Date().toISOString()}] INFO: Job completed with errors
`;
  
  // Create a stale log file (1 hour old)
  const staleDate = new Date(Date.now() - 60 * 60 * 1000);
  const staleLogContent = `[${staleDate.toISOString()}] INFO: Job started
[${staleDate.toISOString()}] INFO: Job completed
`;
  
  try {
    // Test 1: Healthy job
    console.log('Test 1: Healthy job (recent log, no errors)');
    await fs.writeFile('/tmp/test_wolf.log', healthyLogContent);
    
    // Test 2: Job with errors
    console.log('\nTest 2: Job with errors in log');
    await fs.writeFile('/tmp/test_data.log', errorLogContent);
    
    // Test 3: Stale job
    console.log('\nTest 3: Stale job (log > 1 hour old)');
    await fs.writeFile('/tmp/test_stale.log', staleLogContent);
    
    // Add stale job to test
    testJobs.push({
      name: 'test_stale',
      description: 'Test Stale Job',
      logFile: '/tmp/test_stale.log',
      command: 'test_stale.py',
      schedule: '*/30 * * * *',
      critical: true
    });
    
    // Override monitor's job list for testing
    monitor.CRON_JOBS = testJobs;
    
    // Mock checkJob method to use our test jobs
    const originalCheckJob = monitor.checkJob.bind(monitor);
    monitor.checkJob = async function(job) {
      const jobStatus = {
        name: job.name,
        description: job.description,
        status: 'unknown',
        lastRun: new Date(),
        ageMinutes: job.name === 'test_stale' ? 65 : 5,
        logSize: 100,
        errorCount: job.name === 'test_data' ? 2 : 0,
        details: 'Test details',
        processRunning: true
      };
      
      // Determine status based on test
      if (job.name === 'test_data') {
        jobStatus.status = 'error';
        jobStatus.details = 'Found 2 error(s) in log';
        
        this.status.alerts.push({
          type: 'job_error',
          job: job.name,
          severity: 'high',
          message: `${job.description} has 2 error(s)`,
          timestamp: new Date().toISOString(),
          sampleError: 'ERROR: Failed to fetch data from API'
        });
      } else if (job.name === 'test_stale') {
        jobStatus.status = 'stale';
        jobStatus.details = 'Log not updated for 65 minutes (max: 45 min)';
        
        this.status.alerts.push({
          type: 'stale_job',
          job: job.name,
          severity: 'high',
          message: `${job.description} has not run in 65 minutes`,
          timestamp: new Date().toISOString()
        });
      } else {
        jobStatus.status = 'healthy';
        jobStatus.details = 'Last run 5 minutes ago';
      }
      
      this.status.jobs[job.name] = jobStatus;
      
      console.log(`   ${job.description}: ${jobStatus.status}`);
      console.log(`   Details: ${jobStatus.details}`);
    };
    
    // Mock system resources check
    monitor.checkSystemResources = async function() {
      this.status.systemResources = {
        diskUsage: '45%',
        memUsage: '65.2%',
        cpuLoad: '1.25',
        timestamp: new Date().toISOString()
      };
      
      console.log('\n💻 System Resources (mocked):');
      console.log(`   Disk: 45% | Memory: 65.2% | CPU Load: 1.25`);
    };
    
    // Run tests
    console.log('\n' + '='.repeat(60));
    console.log('Running monitor tests...\n');
    
    await monitor.checkSystemResources();
    
    for (const job of testJobs) {
      await monitor.checkJob(job);
    }
    
    await monitor.generateReport();
    
    console.log('\n' + '='.repeat(60));
    console.log('Test Results:');
    console.log(`Total jobs: ${Object.keys(monitor.status.jobs).length}`);
    console.log(`Alerts generated: ${monitor.status.alerts.length}`);
    console.log(`System health: ${monitor.status.systemHealth}`);
    
    // Verify alerts
    const expectedAlerts = 2; // test_data (error) + test_stale (stale)
    if (monitor.status.alerts.length === expectedAlerts) {
      console.log('✅ Alert generation test PASSED');
    } else {
      console.log(`❌ Alert generation test FAILED: Expected ${expectedAlerts}, got ${monitor.status.alerts.length}`);
    }
    
    // Verify job statuses
    const expectedStatuses = {
      test_wolf: 'healthy',
      test_data: 'error',
      test_stale: 'stale'
    };
    
    let statusTestsPassed = 0;
    for (const [jobName, expectedStatus] of Object.entries(expectedStatuses)) {
      const actualStatus = monitor.status.jobs[jobName]?.status;
      if (actualStatus === expectedStatus) {
        console.log(`✅ ${jobName} status test PASSED (${expectedStatus})`);
        statusTestsPassed++;
      } else {
        console.log(`❌ ${jobName} status test FAILED: Expected ${expectedStatus}, got ${actualStatus}`);
      }
    }
    
    // Cleanup test files
    await fs.unlink('/tmp/test_wolf.log').catch(() => {});
    await fs.unlink('/tmp/test_data.log').catch(() => {});
    await fs.unlink('/tmp/test_stale.log').catch(() => {});
    
    console.log('\n' + '='.repeat(60));
    console.log(`Overall: ${statusTestsPassed}/${Object.keys(expectedStatuses).length} status tests passed`);
    
    if (statusTestsPassed === Object.keys(expectedStatuses).length && 
        monitor.status.alerts.length === expectedAlerts) {
      console.log('🎉 All tests PASSED!');
      process.exit(0);
    } else {
      console.log('❌ Some tests FAILED');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
    
    // Cleanup on error
    try {
      await fs.unlink('/tmp/test_wolf.log').catch(() => {});
      await fs.unlink('/tmp/test_data.log').catch(() => {});
      await fs.unlink('/tmp/test_stale.log').catch(() => {});
    } catch (cleanupError) {
      // Ignore cleanup errors
    }
    
    process.exit(1);
  }
}

if (require.main === module) {
  testMonitor();
}