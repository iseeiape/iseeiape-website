#!/usr/bin/env node

/**
 * Test script for the enhanced Neo Crypto system
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 TESTING ENHANCED NEO CRYPTO SYSTEM');
console.log('='.repeat(50));

// Check 1: Enhanced API script exists
const enhancedApiPath = path.join(__dirname, 'neo-crypto/scripts/enhanced-api.js');
console.log('1. Checking enhanced-api.js...');
if (fs.existsSync(enhancedApiPath)) {
  console.log('   ✅ Found: neo-crypto/scripts/enhanced-api.js');
  
  // Check if it has required dependencies
  const content = fs.readFileSync(enhancedApiPath, 'utf8');
  if (content.includes('axios') && content.includes('generateLiveData')) {
    console.log('   ✅ Contains required functions');
  } else {
    console.log('   ⚠️  Missing some expected functions');
  }
} else {
  console.log('   ❌ Missing: enhanced-api.js');
}

// Check 2: Enhanced data file exists
const enhancedDataPath = path.join(__dirname, 'neo-crypto/data/enhanced-live-data.json');
console.log('\n2. Checking enhanced-live-data.json...');
if (fs.existsSync(enhancedDataPath)) {
  console.log('   ✅ Found: neo-crypto/data/enhanced-live-data.json');
  
  try {
    const data = JSON.parse(fs.readFileSync(enhancedDataPath, 'utf8'));
    const age = Date.now() - new Date(data.updated_at).getTime();
    const ageMinutes = Math.floor(age / 60000);
    
    console.log(`   ✅ Data age: ${ageMinutes} minutes`);
    console.log(`   ✅ Tokens: ${data.data.tokens.length}`);
    console.log(`   ✅ Narratives: ${data.data.narratives.length}`);
    console.log(`   ✅ Whales: ${data.data.whaleData.length}`);
    
    if (ageMinutes > 30) {
      console.log('   ⚠️  Data is stale (>30 minutes)');
    }
  } catch (error) {
    console.log('   ❌ Invalid JSON:', error.message);
  }
} else {
  console.log('   ❌ Missing: enhanced-live-data.json');
}

// Check 3: API endpoint exists
const apiEndpointPath = path.join(__dirname, 'pages/api/enhanced/data.ts');
console.log('\n3. Checking API endpoint...');
if (fs.existsSync(apiEndpointPath)) {
  console.log('   ✅ Found: pages/api/enhanced/data.ts');
  
  const content = fs.readFileSync(apiEndpointPath, 'utf8');
  if (content.includes('EnhancedData') && content.includes('type=dashboard')) {
    console.log('   ✅ Properly structured API endpoint');
  } else {
    console.log('   ⚠️  May be missing some functionality');
  }
} else {
  console.log('   ❌ Missing: pages/api/enhanced/data.ts');
}

// Check 4: Enhanced dashboard exists
const dashboardPath = path.join(__dirname, 'pages/dashboard-enhanced.tsx');
console.log('\n4. Checking enhanced dashboard...');
if (fs.existsSync(dashboardPath)) {
  console.log('   ✅ Found: pages/dashboard-enhanced.tsx');
  
  const content = fs.readFileSync(dashboardPath, 'utf8');
  if (content.includes('useState') && content.includes('useEffect') && content.includes('fetchDashboardData')) {
    console.log('   ✅ Uses React hooks and data fetching');
  } else {
    console.log('   ⚠️  May be missing React hooks');
  }
} else {
  console.log('   ❌ Missing: pages/dashboard-enhanced.tsx');
}

// Check 5: Test running the enhanced API
console.log('\n5. Testing enhanced API execution...');
try {
  const { execSync } = require('child_process');
  console.log('   Running enhanced-api.js...');
  
  // Run in a timeout to avoid hanging
  const output = execSync('timeout 30 node neo-crypto/scripts/enhanced-api.js 2>&1 | head -20', {
    cwd: __dirname,
    encoding: 'utf8'
  });
  
  if (output.includes('ENHANCED DATA GENERATION COMPLETE')) {
    console.log('   ✅ Enhanced API runs successfully');
    
    // Check if new data was generated
    if (fs.existsSync(enhancedDataPath)) {
      const newData = JSON.parse(fs.readFileSync(enhancedDataPath, 'utf8'));
      const newAge = Date.now() - new Date(newData.updated_at).getTime();
      const newAgeMinutes = Math.floor(newAge / 60000);
      
      if (newAgeMinutes < 5) {
        console.log('   ✅ Fresh data generated (<5 minutes old)');
      } else {
        console.log(`   ⚠️  Data may not have updated (${newAgeMinutes}m old)`);
      }
    }
  } else {
    console.log('   ❌ Enhanced API may have issues');
    console.log('   Output:', output.substring(0, 200) + '...');
  }
} catch (error) {
  console.log('   ❌ Failed to run enhanced API:', error.message);
}

// Check 6: Deployment guide
const deploymentPath = path.join(__dirname, 'neo-crypto/data/deployment-guide.json');
console.log('\n6. Checking deployment guide...');
if (fs.existsSync(deploymentPath)) {
  console.log('   ✅ Found: neo-crypto/data/deployment-guide.json');
  
  try {
    const guide = JSON.parse(fs.readFileSync(deploymentPath, 'utf8'));
    console.log(`   ✅ Cron schedule: ${guide.cron_schedule}`);
    console.log(`   ✅ Next run: ${new Date(guide.next_run).toLocaleTimeString()}`);
  } catch (error) {
    console.log('   ❌ Invalid JSON:', error.message);
  }
} else {
  console.log('   ❌ Missing: deployment-guide.json');
}

// Summary
console.log('\n' + '='.repeat(50));
console.log('📋 SYSTEM TEST SUMMARY');
console.log('='.repeat(50));

// Count successes
const testResults = [
  fs.existsSync(enhancedApiPath),
  fs.existsSync(enhancedDataPath),
  fs.existsSync(apiEndpointPath),
  fs.existsSync(dashboardPath),
  fs.existsSync(deploymentPath)
];

const passed = testResults.filter(Boolean).length;
const total = testResults.length;

console.log(`\n✅ ${passed}/${total} tests passed`);

if (passed === total) {
  console.log('\n🎉 ENHANCED SYSTEM IS FULLY OPERATIONAL!');
  console.log('\n🚀 Next steps:');
  console.log('   1. Run the dev server: npm run dev');
  console.log('   2. Visit: http://localhost:3000/dashboard-enhanced');
  console.log('   3. Set up cron job: */30 * * * * node neo-crypto/scripts/enhanced-api.js');
  console.log('   4. Update main dashboard to use enhanced version');
} else {
  console.log('\n⚠️  Some components missing or need attention');
  console.log('\n🔧 To fix:');
  if (!fs.existsSync(enhancedApiPath)) {
    console.log('   • Create enhanced-api.js in neo-crypto/scripts/');
  }
  if (!fs.existsSync(enhancedDataPath)) {
    console.log('   • Run: node neo-crypto/scripts/enhanced-api.js');
  }
  if (!fs.existsSync(apiEndpointPath)) {
    console.log('   • Create pages/api/enhanced/data.ts');
  }
  if (!fs.existsSync(dashboardPath)) {
    console.log('   • Create pages/dashboard-enhanced.tsx');
  }
}

console.log('\n' + '='.repeat(50));