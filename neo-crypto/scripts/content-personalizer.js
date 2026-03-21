#!/usr/bin/env node

/**
 * Content Personalizer - Customizes content based on user preferences and behavior
 * 
 * This system personalizes premium content for different user segments
 * based on their trading style, risk tolerance, and interests.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  outputDir: path.join(__dirname, '../data/personalized-content'),
  userProfilesPath: path.join(__dirname, '../data/user-profiles.json'),
  contentTemplatesDir: path.join(__dirname, '../templates'),
  
  // User segments
  userSegments: {
    AGGRESSIVE_TRADER: 'aggressive_trader',
    CONSERVATIVE_INVESTOR: 'conservative_investor',
    NEW_TRADER: 'new_trader',
    DEFI_ENthusiast: 'defi_enthusiast',
    AI_FOCUSED: 'ai_focused',
    MEME_TRADER: 'meme_trader'
  },
  
  // Content types
  contentTypes: {
    DAILY_REPORT: 'daily_report',
    WEEKLY_NEWSLETTER: 'weekly_newsletter',
    TRADING_SIGNAL: 'trading_signal',
    MARKET_ANALYSIS: 'market_analysis',
    EDUCATIONAL: 'educational'
  }
};

// Ensure directories exist
function ensureDirectories() {
  if (!fs.existsSync(CONFIG.outputDir)) {
    fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    console.log(`📁 Created directory: ${CONFIG.outputDir}`);
  }
}

// Load user profiles
function loadUserProfiles() {
  try {
    if (!fs.existsSync(CONFIG.userProfilesPath)) {
      console.log('⚠️  No user profiles found, creating sample data');
      return createSampleProfiles();
    }
    
    const data = JSON.parse(fs.readFileSync(CONFIG.userProfilesPath, 'utf8'));
    console.log(`📊 Loaded ${data.users.length} user profiles`);
    return data;
  } catch (error) {
    console.error('❌ Error loading user profiles:', error.message);
    return createSampleProfiles();
  }
}

// Create sample user profiles (for testing)
function createSampleProfiles() {
  const sampleProfiles = {
    users: [
      {
        id: 'user_001',
        name: 'Alex Trader',
        segment: CONFIG.userSegments.AGGRESSIVE_TRADER,
        preferences: {
          riskTolerance: 'high',
          tradingStyle: 'scalping',
          favoriteCategories: ['alpha', 'momentum'],
          portfolioSize: 50000,
          experienceLevel: 'advanced',
          interests: ['ai_agents', 'defi', 'new_pairs']
        },
        behavior: {
          avgTradeSize: 5000,
          avgHoldTime: '4h',
          successRate: 0.65,
          activeHours: ['09:00-12:00', '14:00-18:00']
        }
      },
      {
        id: 'user_002',
        name: 'Sarah Investor',
        segment: CONFIG.userSegments.CONSERVATIVE_INVESTOR,
        preferences: {
          riskTolerance: 'low',
          tradingStyle: 'swing_trading',
          favoriteCategories: ['whale', 'alpha'],
          portfolioSize: 100000,
          experienceLevel: 'intermediate',
          interests: ['defi', 'infrastructure', 'staking']
        },
        behavior: {
          avgTradeSize: 10000,
          avgHoldTime: '3d',
          successRate: 0.75,
          activeHours: ['10:00-16:00']
        }
      },
      {
        id: 'user_003',
        name: 'Mike Beginner',
        segment: CONFIG.userSegments.NEW_TRADER,
        preferences: {
          riskTolerance: 'medium',
          tradingStyle: 'learning',
          favoriteCategories: ['new_pair', 'momentum'],
          portfolioSize: 5000,
          experienceLevel: 'beginner',
          interests: ['education', 'meme_coins', 'community']
        },
        behavior: {
          avgTradeSize: 500,
          avgHoldTime: '1d',
          successRate: 0.45,
          activeHours: ['18:00-22:00']
        }
      }
    ]
  };
  
  // Save sample profiles
  fs.writeFileSync(CONFIG.userProfilesPath, JSON.stringify(sampleProfiles, null, 2), 'utf8');
  console.log(`💾 Created ${sampleProfiles.users.length} sample user profiles`);
  
  return sampleProfiles;
}

// Load content template
function loadContentTemplate(contentType) {
  const templateFile = path.join(CONFIG.contentTemplatesDir, `${contentType}.md`);
  
  try {
    if (!fs.existsSync(templateFile)) {
      console.error(`❌ Template not found: ${templateFile}`);
      return null;
    }
    
    const template = fs.readFileSync(templateFile, 'utf8');
    console.log(`📄 Loaded template: ${contentType}`);
    return template;
  } catch (error) {
    console.error(`❌ Error loading template ${contentType}:`, error.message);
    return null;
  }
}

// Personalize content for user segment
function personalizeContent(template, userSegment, contextData) {
  console.log(`🎨 Personalizing content for ${userSegment} segment...`);
  
  // Segment-specific customizations
  const segmentCustomizations = {
    [CONFIG.userSegments.AGGRESSIVE_TRADER]: {
      tone: 'direct, urgent, high-energy',
      focus: 'short-term gains, high-conviction plays',
      riskEmphasis: 'calculated risks, aggressive positioning',
      callToAction: 'Execute now, size up on winners',
      examples: 'scalping opportunities, momentum plays'
    },
    [CONFIG.userSegments.CONSERVATIVE_INVESTOR]: {
      tone: 'measured, analytical, patient',
      focus: 'risk-adjusted returns, sustainable growth',
      riskEmphasis: 'capital preservation, downside protection',
      callToAction: 'Research thoroughly, position selectively',
      examples: 'whale accumulation, infrastructure plays'
    },
    [CONFIG.userSegments.NEW_TRADER]: {
      tone: 'educational, supportive, clear',
      focus: 'learning opportunities, low-risk practice',
      riskEmphasis: 'start small, learn from mistakes',
      callToAction: 'Paper trade first, join community',
      examples: 'educational content, community picks'
    },
    [CONFIG.userSegments.DEFI_ENthusiast]: {
      tone: 'technical, innovative, forward-looking',
      focus: 'protocol fundamentals, tokenomics',
      riskEmphasis: 'smart contract risk, regulatory',
      callToAction: 'DYOR on protocols, monitor governance',
      examples: 'DeFi alpha, yield opportunities'
    },
    [CONFIG.userSegments.AI_FOCUSED]: {
      tone: 'cutting-edge, data-driven, algorithmic',
      focus: 'AI agents, automation, data signals',
      riskEmphasis: 'model risk, data quality',
      callToAction: 'Leverage tools, automate workflows',
      examples: 'AI trading signals, bot strategies'
    },
    [CONFIG.userSegments.MEME_TRADER]: {
      tone: 'fun, community-driven, viral',
      focus: 'social sentiment, community momentum',
      riskEmphasis: 'extreme volatility, pump/dump risk',
      callToAction: 'Watch sentiment, exit with profits',
      examples: 'meme coin opportunities, community plays'
    }
  };
  
  const customization = segmentCustomizations[userSegment] || segmentCustomizations[CONFIG.userSegments.AGGRESSIVE_TRADER];
  
  // Replace template variables with personalized content
  let personalized = template;
  
  // Replace generic variables
  personalized = personalized.replace(/{{tone}}/g, customization.tone);
  personalized = personalized.replace(/{{focus}}/g, customization.focus);
  personalized = personalized.replace(/{{risk_emphasis}}/g, customization.riskEmphasis);
  personalized = personalized.replace(/{{call_to_action}}/g, customization.callToAction);
  personalized = personalized.replace(/{{examples}}/g, customization.examples);
  
  // Add segment-specific header
  const segmentHeader = `\n> **Personalized for ${userSegment.replace('_', ' ').toUpperCase()}**\n> ${getSegmentDescription(userSegment)}\n\n`;
  personalized = personalized.replace(/# 🚀/, `# 🚀${segmentHeader}`);
  
  // Customize recommendations based on segment
  personalized = customizeRecommendations(personalized, userSegment, contextData);
  
  // Customize risk warnings
  personalized = customizeRiskWarnings(personalized, userSegment);
  
  // Customize educational content
  personalized = customizeEducationalContent(personalized, userSegment);
  
  console.log(`✅ Personalized content for ${userSegment}`);
  return personalized;
}

// Get segment description
function getSegmentDescription(segment) {
  const descriptions = {
    [CONFIG.userSegments.AGGRESSIVE_TRADER]: 'High-risk tolerance, short-term focus, maximum alpha pursuit',
    [CONFIG.userSegments.CONSERVATIVE_INVESTOR]: 'Capital preservation, long-term growth, risk-adjusted returns',
    [CONFIG.userSegments.NEW_TRADER]: 'Learning phase, small positions, community support',
    [CONFIG.userSegments.DEFI_ENthusiast]: 'Protocol-focused, yield-seeking, technical analysis',
    [CONFIG.userSegments.AI_FOCUSED]: 'Data-driven, automated, algorithmic approach',
    [CONFIG.userSegments.MEME_TRADER]: 'Community-driven, sentiment-focused, viral opportunities'
  };
  
  return descriptions[segment] || 'General trading insights';
}

// Customize recommendations based on segment
function customizeRecommendations(content, segment, contextData) {
  let customized = content;
  
  // Get appropriate position sizing based on segment
  const positionSizing = {
    [CONFIG.userSegments.AGGRESSIVE_TRADER]: '3-5% per position, up to 8% for high conviction',
    [CONFIG.userSegments.CONSERVATIVE_INVESTOR]: '1-2% per position, maximum 3%',
    [CONFIG.userSegments.NEW_TRADER]: '0.5-1% per position, paper trade first',
    [CONFIG.userSegments.DEFI_ENthusiast]: '2-3% per position, focus on fundamentals',
    [CONFIG.userSegments.AI_FOCUSED]: '2-4% per position, use automation',
    [CONFIG.userSegments.MEME_TRADER]: '1-2% per position, strict stop losses'
  };
  
  const sizing = positionSizing[segment] || '2-3% per position';
  customized = customized.replace(/{{position_sizing}}/g, sizing);
  
  // Customize hold times
  const holdTimes = {
    [CONFIG.userSegments.AGGRESSIVE_TRADER]: '1-4 hours for momentum, 4-24 hours for alpha',
    [CONFIG.userSegments.CONSERVATIVE_INVESTOR]: '1-7 days for swing trades, 1+ months for investments',
    [CONFIG.userSegments.NEW_TRADER]: '1-3 days to learn, focus on process not profits',
    [CONFIG.userSegments.DEFI_ENthusiast]: '1-14 days based on protocol developments',
    [CONFIG.userSegments.AI_FOCUSED]: 'Algorithm-determined, typically 1-12 hours',
    [CONFIG.userSegments.MEME_TRADER]: 'Minutes to hours, exit on momentum shift'
  };
  
  const holdTime = holdTimes[segment] || '1-3 days';
  customized = customized.replace(/{{hold_time}}/g, holdTime);
  
  // Filter signals based on segment preferences
  if (contextData && contextData.signals) {
    const filteredSignals = filterSignalsForSegment(contextData.signals, segment);
    const signalsHTML = generateSignalsHTML(filteredSignals, segment);
    customized = customized.replace(/{{filtered_signals}}/g, signalsHTML);
  }
  
  return customized;
}

// Filter signals for segment
function filterSignalsForSegment(signals, segment) {
  const segmentFilters = {
    [CONFIG.userSegments.AGGRESSIVE_TRADER]: (signal) => 
      signal.confidence >= 80 && signal.urgency === 'HIGH',
    
    [CONFIG.userSegments.CONSERVATIVE_INVESTOR]: (signal) => 
      signal.confidence >= 85 && signal.riskLevel === 'LOW',
    
    [CONFIG.userSegments.NEW_TRADER]: (signal) => 
      signal.confidence >= 75 && signal.riskLevel !== 'HIGH',
    
    [CONFIG.userSegments.DEFI_ENthusiast]: (signal) => 
      signal.category === 'defi' || signal.symbol.includes('DEFI'),
    
    [CONFIG.userSegments.AI_FOCUSED]: (signal) => 
      signal.mlScore >= 80 || signal.source.includes('ai'),
    
    [CONFIG.userSegments.MEME_TRADER]: (signal) => 
      signal.category === 'meme' || signal.socialSentiment >= 70
  };
  
  const filter = segmentFilters[segment] || (() => true);
  return signals.filter(filter).slice(0, 5); // Top 5 filtered signals
}

// Generate signals HTML
function generateSignalsHTML(signals, segment) {
  if (signals.length === 0) {
    return 'No signals match your current preferences. Check back later or adjust filters.';
  }
  
  let html = '### Personalized Signals for You\n\n';
  
  signals.forEach((signal, index) => {
    html += `#### ${index + 1}. ${signal.symbol} - ${signal.recommendation}\n`;
    html += `- **Confidence:** ${signal.confidence}%\n`;
    html += `- **Entry:** $${signal.entryPrice}\n`;
    html += `- **Stop Loss:** $${signal.stopLoss}\n`;
    html += `- **Take Profit:** $${signal.takeProfit}\n`;
    html += `- **Risk Level:** ${signal.riskLevel}\n`;
    html += `- **Why it fits your style:** ${getSegmentFitReason(signal, segment)}\n\n`;
  });
  
  return html;
}

// Get segment fit reason
function getSegmentFitReason(signal, segment) {
  const reasons = {
    [CONFIG.userSegments.AGGRESSIVE_TRADER]: 'High conviction, rapid movement potential',
    [CONFIG.userSegments.CONSERVATIVE_INVESTOR]: 'Strong fundamentals, limited downside',
    [CONFIG.userSegments.NEW_TRADER]: 'Good learning opportunity, manageable risk',
    [CONFIG.userSegments.DEFI_ENthusiast]: 'Protocol innovation, strong tokenomics',
    [CONFIG.userSegments.AI_FOCUSED]: 'Data-driven signal, algorithmic edge',
    [CONFIG.userSegments.MEME_TRADER]: 'Community momentum, viral potential'
  };
  
  return reasons[segment] || 'Matches your trading profile';
}

// Customize risk warnings
function customizeRiskWarnings(content, segment) {
  let customized = content;
  
  const riskWarnings = {
    [CONFIG.userSegments.AGGRESSIVE_TRADER]: '⚠️ **Aggressive Trading Warning**: High risk of significant losses. Only risk capital you can afford to lose completely. Use strict stop losses.',
    [CONFIG.userSegments.CONSERVATIVE_INVESTOR]: '⚠️ **Conservative Approach**: While lower risk, crypto remains volatile. Diversify and never invest emergency funds.',
    [CONFIG.userSegments.NEW_TRADER]: '⚠️ **Beginner Guidance**: Start with paper trading. Losses are part of learning. Focus on education before profits.',
    [CONFIG.userSegments.DEFI_ENthusiast]: '⚠️ **DeFi Specific Risks**: Smart contract risk, impermanent loss, regulatory uncertainty. Audit protocols thoroughly.',
    [CONFIG.userSegments.AI_FOCUSED]: '⚠️ **AI Model Risks**: Models can fail. Backtest thoroughly. Human oversight required for all automated trading.',
    [CONFIG.userSegments.MEME_TRADER]: '⚠️ **Meme Coin Warning**: Extreme volatility. Most meme coins fail. Only play with "fun money". Exit with profits.'
  };
  
  const warning = riskWarnings[segment] || '⚠️ Trading involves risk. Only risk what you can afford to lose.';
  customized = customized.replace(/{{risk_warning}}/g, warning);
  
  return customized;
}

// Customize educational content
function customizeEducationalContent(content, segment) {
  let customized = content;
  
  const educationalTopics = {
    [CONFIG.userSegments.AGGRESSIVE_TRADER]: 'Advanced position sizing, scaling strategies, exit optimization',
    [CONFIG.userSegments.CONSERVATIVE_INVESTOR]: 'Portfolio construction, risk parity, hedging strategies',
    [CONFIG.userSegments.NEW_TRADER]: 'Basic terminology, reading charts, setting up first trade',
    [CONFIG.userSegments.DEFI_ENthusiast]: 'Protocol analysis, yield farming strategies, governance participation',
    [CONFIG.userSegments.AI_FOCUSED]: 'Model backtesting, feature engineering, automation setup',
    [CONFIG.userSegments.MEME_TRADER]: 'Sentiment analysis, community tracking, exit timing'
  };
  
  const topic = educationalTopics[segment] || 'General trading education';
  customized = customized.replace(/{{educational_topic}}/g, topic);
  
  return customized;
}

// Generate personalized content for all users
function generatePersonalizedContent(contentType, contextData) {
  console.log(`\n🎭 Generating personalized ${contentType} for all segments...`);
  
  const userProfiles = loadUserProfiles();
  const template = loadContentTemplate(contentType);
  
  if (!template) {
    console.error('❌ Cannot generate content without template');
    return [];
  }
  
  const personalizedContents = [];
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  // Generate for each segment
  const segments = Object.values(CONFIG.userSegments);
  
  for (const segment of segments) {
    // Personalize template for this segment
    const personalized = personalizeContent(template, segment, contextData);
    
    // Save personalized content
    const filename = `${contentType}-${segment}-${timestamp}.md`;
    const filepath = path.join(CONFIG.outputDir, filename);
    
    fs.writeFileSync(filepath, personalized, 'utf8');
    
    personalizedContents.push({
      segment,
      filename,
      filepath,
      content: personalized.substring(0, 500) + '...' // Store preview
    });
    
    console.log(`💾 Saved ${segment} version: ${filename}`);
  }
  
  // Generate summary
  const summary = {
    metadata: {
      generatedAt: new Date().toISOString(),
      contentType,
      segmentCount: segments.length,
      contextDataAvailable: !!contextData
    },
    contents: personalizedContents.map(pc => ({
      segment: pc.segment,
      filename: pc.filename,
      preview: pc.content
    }))
  };
  
  const summaryFile = path.join(CONFIG.outputDir, `personalization-summary-${timestamp}.json`);
  fs.writeFileSync(summaryFile, JSON.stringify(summary, null, 2), 'utf8');
  console.log(`💾 Personalization summary saved: ${summaryFile}`);
  
  return personalizedContents;
}

// Main execution
async function main() {
  console.log('🎭 Content Personalizer');
  console.log('='.repeat(50));
  
  ensureDirectories();
  
  try {
    // Load context data (signals, market data, etc.)
    console.log('📊 Loading context data...');
    const contextData = await loadContextData();
    
    // Generate personalized daily reports
    console.log('\n📝 Generating personalized daily reports...');
    const dailyReports = generatePersonalizedContent(
      CONFIG.contentTypes.DAILY_REPORT,
      contextData
    );
    
    // Generate personalized newsletters
    console.log('\n📧 Generating personalized newsletters...');
    const newsletters = generatePersonalizedContent(
      CONFIG.contentTypes.WEEKLY_NEWSLETTER,
      contextData
    );
    
    console.log('\n✅ Content Personalizer completed successfully!');
    console.log(`📄 Generated: ${dailyReports.length} daily reports`);
    console.log(`📧 Generated: ${newsletters.length} newsletters`);
    console.log(`👥 Segments covered: ${Object.values(CONFIG.userSegments).length}`);
    
    return { 
      success: true, 
      dailyReports: dailyReports.length,
      newsletters: newsletters.length,
      segments: Object.values(CONFIG.userSegments).length
    };
    
  } catch (error) {
    console.error('❌ Content Personalizer failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Load context data (mock for now)
async function loadContextData() {
  // In production, this would load real trading signals, market data, etc.
  return {
    signals: [
      {
        symbol: 'SOL',
        confidence: 88,
        recommendation: 'BUY',
        entryPrice: '150.25',
        stopLoss: '142.74',
        takeProfit: '172.79',
        riskLevel: 'MEDIUM',
        category: 'alpha',
        mlScore: 85,
        source: 'wolf_pack_ml',
        urgency: 'HIGH',
        socialSentiment: 75
      },
      {
        symbol: 'BONK',
        confidence: 72,
        recommendation: 'WATCH',
        entryPrice: '0.000025',
        stopLoss: '0.0000225',
        takeProfit: '0.000031',
        riskLevel: 'HIGH',
        category: 'meme',
        mlScore: 68,
        source: 'wolf_pack',
        urgency: 'MEDIUM',
        socialSentiment: 85
      },
      {
        symbol: 'JUP',
        confidence: 85,
        recommendation: 'BUY',
        entryPrice: '1.35',
        stopLoss: '1.28',
        takeProfit: '1.55',
        riskLevel: 'LOW',
        category: 'defi',
        mlScore: 82,
        source: 'wolf_pack_ml',
        urgency: 'MEDIUM_HIGH',
        socialSentiment: 70
      }
    ],
    marketData: {
      overallTrend: 'bullish',
      sentimentScore: 68,
      volatility: 'high'
    }
  };
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = {
  loadUserProfiles,
  personalizeContent,
  generatePersonalizedContent,
  main
};