#!/usr/bin/env node

/**
 * Content Quality Scorer
 * Scores content on 5 dimensions and provides quality categorization
 */

class ContentQualityScorer {
  constructor() {
    this.scoringWeights = {
      relevance: 25,
      urgency: 25,
      educationalValue: 20,
      actionability: 20,
      engagementPotential: 10
    };
    
    this.qualityThresholds = {
      high: 80,
      medium: 70,
      review: 60,
      reject: 0
    };
  }

  /**
   * Score content based on multiple dimensions
   */
  scoreContent(content, context = {}) {
    const scores = {
      relevance: this.scoreRelevance(content, context),
      urgency: this.scoreUrgency(content, context),
      educationalValue: this.scoreEducationalValue(content),
      actionability: this.scoreActionability(content),
      engagementPotential: this.scoreEngagementPotential(content)
    };
    
    // Calculate weighted total
    const totalScore = Object.entries(scores).reduce((total, [dimension, score]) => {
      return total + (score * this.scoringWeights[dimension] / 100);
    }, 0);
    
    // Determine quality category
    const category = this.determineQualityCategory(totalScore);
    
    return {
      totalScore: Math.round(totalScore),
      scores,
      category,
      feedback: this.generateFeedback(scores, category),
      recommendations: this.generateRecommendations(scores, category)
    };
  }

  /**
   * Score relevance (0-100)
   * How relevant is this content to current market conditions?
   */
  scoreRelevance(content, context) {
    let score = 50; // Base score
    
    // Content type relevance
    if (content.type === 'whale-alert' && context.hasWhaleActivity) score += 30;
    if (content.type === 'trend-alert' && context.hasTrendingNarrative) score += 25;
    if (content.type === 'market-update') score += 20;
    
    // Market condition relevance
    if (context.marketVolatility > 0.05) score += 15; // High volatility
    if (context.significantNews) score += 20;
    
    // Token relevance
    if (content.tokens && content.tokens.some(t => context.topTokens.includes(t))) score += 10;
    
    return Math.min(100, score);
  }

  /**
   * Score urgency (0-100)
   * How time-sensitive is this content?
   */
  scoreUrgency(content, context) {
    let score = 30; // Base score
    
    // Content type urgency
    if (content.type === 'whale-alert') score += 40;
    if (content.type === 'trend-alert' && context.narrativeScore > 80) score += 30;
    if (content.type === 'market-update') score += 20;
    
    // Time factors
    if (content.priority === 'high') score += 25;
    if (context.recentEvent) score += 20; // Event in last hour
    
    // Price action urgency
    if (context.largePriceMove) score += 15;
    if (context.highVolume) score += 10;
    
    return Math.min(100, score);
  }

  /**
   * Score educational value (0-100)
   * How much does this content teach?
   */
  scoreEducationalValue(content) {
    let score = 20; // Base score
    
    // Content type educational value
    if (content.type === 'educational') score += 60;
    if (content.type === 'market-update' && content.includesAnalysis) score += 30;
    
    // Educational elements
    if (content.includesStrategy) score += 25;
    if (content.includesExamples) score += 20;
    if (content.includesRiskManagement) score += 15;
    if (content.includesProTips) score += 10;
    
    // Clarity and structure
    if (content.wellStructured) score += 15;
    if (content.clearLanguage) score += 10;
    
    return Math.min(100, score);
  }

  /**
   * Score actionability (0-100)
   * How actionable is this content?
   */
  scoreActionability(content) {
    let score = 25; // Base score
    
    // Clear calls to action
    if (content.includesClearAction) score += 30;
    if (content.includesSpecificLevels) score += 25;
    if (content.includesWatchlist) score += 20;
    
    // Risk/reward clarity
    if (content.includesRiskReward) score += 15;
    if (content.includesEntryExit) score += 15;
    
    // Token specificity
    if (content.specificTokens) score += 10;
    if (content.specificPrices) score += 10;
    
    return Math.min(100, score);
  }

  /**
   * Score engagement potential (0-100)
   * How likely is this to get interactions?
   */
  scoreEngagementPotential(content) {
    let score = 30; // Base score
    
    // Formatting and style
    if (content.includesEmojis) score += 20;
    if (content.includesHashtags) score += 15;
    if (content.includesQuestions) score += 15;
    
    // Content appeal
    if (content.controversialOrBold) score += 15;
    if (content.includesDataVisualization) score += 10;
    if (content.includesPollsOrPuzzles) score += 10;
    
    // Length optimization
    if (content.optimalLength) score += 10; // Not too long, not too short
    
    return Math.min(100, score);
  }

  /**
   * Determine quality category based on total score
   */
  determineQualityCategory(score) {
    if (score >= this.qualityThresholds.high) return 'high';
    if (score >= this.qualityThresholds.medium) return 'medium';
    if (score >= this.qualityThresholds.review) return 'needs_review';
    return 'reject';
  }

  /**
   * Generate feedback based on scores
   */
  generateFeedback(scores, category) {
    const feedback = [];
    
    // Relevance feedback
    if (scores.relevance < 60) {
      feedback.push('Increase relevance by tying to current market events or trending narratives');
    } else if (scores.relevance > 80) {
      feedback.push('Excellent relevance to current market conditions');
    }
    
    // Urgency feedback
    if (scores.urgency < 50) {
      feedback.push('Add time-sensitive elements or recent events to increase urgency');
    } else if (scores.urgency > 75) {
      feedback.push('Strong urgency - content should be posted soon');
    }
    
    // Educational feedback
    if (scores.educationalValue < 40) {
      feedback.push('Add educational elements like strategies, examples, or pro tips');
    } else if (scores.educationalValue > 70) {
      feedback.push('High educational value - teaches something valuable');
    }
    
    // Actionability feedback
    if (scores.actionability < 50) {
      feedback.push('Make more actionable with specific levels, tokens, or clear next steps');
    } else if (scores.actionability > 75) {
      feedback.push('Highly actionable - clear next steps for readers');
    }
    
    // Engagement feedback
    if (scores.engagementPotential < 50) {
      feedback.push('Improve engagement with emojis, questions, or interactive elements');
    } else if (scores.engagementPotential > 70) {
      feedback.push('High engagement potential - likely to get interactions');
    }
    
    // Category-specific feedback
    if (category === 'high') {
      feedback.push('✅ Ready for immediate posting');
    } else if (category === 'medium') {
      feedback.push('✅ Good quality, consider minor improvements');
    } else if (category === 'needs_review') {
      feedback.push('⚠️ Needs manual review before posting');
    } else {
      feedback.push('❌ Consider regenerating or significantly improving');
    }
    
    return feedback;
  }

  /**
   * Generate specific recommendations for improvement
   */
  generateRecommendations(scores, category) {
    const recommendations = [];
    
    // Find lowest scoring dimension
    const lowestDimension = Object.entries(scores).reduce((lowest, [dim, score]) => {
      return score < lowest.score ? { dimension: dim, score } : lowest;
    }, { dimension: '', score: 100 });
    
    // Recommendations based on lowest dimension
    switch (lowestDimension.dimension) {
      case 'relevance':
        recommendations.push(
          'Link to current market events',
          'Reference trending narratives',
          'Include top-performing tokens',
          'Connect to recent news'
        );
        break;
      case 'urgency':
        recommendations.push(
          'Add time-sensitive information',
          'Reference recent price action',
          'Include breaking news if applicable',
          'Use urgent language appropriately'
        );
        break;
      case 'educationalValue':
        recommendations.push(
          'Add a trading strategy',
          'Include specific examples',
          'Explain risk management',
          'Share pro tips or insights'
        );
        break;
      case 'actionability':
        recommendations.push(
          'Provide clear entry/exit levels',
          'List specific tokens to watch',
          'Give clear next steps',
          'Include risk/reward ratios'
        );
        break;
      case 'engagementPotential':
        recommendations.push(
          'Add relevant emojis',
          'Include questions for interaction',
          'Use hashtags strategically',
          'Consider adding a poll or puzzle'
        );
        break;
    }
    
    // Additional recommendations based on category
    if (category === 'needs_review' || category === 'reject') {
      recommendations.push(
        'Review and improve the lowest scoring dimensions',
        'Consider combining with higher-scoring content',
        'Get human review before posting',
        'Regenerate if multiple dimensions are low'
      );
    }
    
    return recommendations;
  }

  /**
   * Batch score multiple content pieces
   */
  batchScore(contentList, context = {}) {
    return contentList.map(content => ({
      content,
      score: this.scoreContent(content, context)
    }));
  }

  /**
   * Generate scoring report
   */
  generateReport(scoredContent) {
    const report = {
      summary: {
        totalContent: scoredContent.length,
        averageScore: 0,
        distribution: {
          high: 0,
          medium: 0,
          needs_review: 0,
          reject: 0
        }
      },
      details: []
    };
    
    let totalScore = 0;
    
    scoredContent.forEach((item, index) => {
      totalScore += item.score.totalScore;
      
      report.summary.distribution[item.score.category]++;
      
      report.details.push({
        index: index + 1,
        type: item.content.type,
        totalScore: item.score.totalScore,
        category: item.score.category,
        dimensions: item.score.scores,
        feedback: item.score.feedback
      });
    });
    
    report.summary.averageScore = Math.round(totalScore / scoredContent.length);
    
    return report;
  }
}

// Example usage and testing
if (require.main === module) {
  const scorer = new ContentQualityScorer();
  
  // Test content
  const testContent = [
    {
      type: 'whale-alert',
      priority: 'high',
      includesClearAction: true,
      includesSpecificLevels: true,
      includesEmojis: true,
      includesHashtags: true
    },
    {
      type: 'educational',
      includesStrategy: true,
      includesExamples: true,
      includesRiskManagement: true,
      includesProTips: true,
      wellStructured: true,
      clearLanguage: true
    }
  ];
  
  const testContext = {
    hasWhaleActivity: true,
    hasTrendingNarrative: true,
    marketVolatility: 0.08,
    significantNews: true,
    topTokens: ['SOL', 'BONK', 'JUP'],
    narrativeScore: 85,
    recentEvent: true,
    largePriceMove: true,
    highVolume: true
  };
  
  console.log('🧪 Testing Content Quality Scorer\n');
  
  testContent.forEach((content, i) => {
    console.log(`\n${i + 1}. ${content.type.toUpperCase()}:`);
    const score = scorer.scoreContent(content, testContext);
    
    console.log(`   Total Score: ${score.totalScore}/100`);
    console.log(`   Category: ${score.category}`);
    console.log(`   Dimensions:`);
    Object.entries(score.scores).forEach(([dim, val]) => {
      console.log(`     • ${dim}: ${val}/100`);
    });
    
    console.log(`\n   Feedback:`);
    score.feedback.forEach(f => console.log(`     • ${f}`));
    
    console.log(`\n   Recommendations:`);
    score.recommendations.forEach(r => console.log(`     • ${r}`));
  });
  
  // Batch scoring example
  console.log('\n\n📊 Batch Scoring Report:');
  const batchScored = scorer.batchScore(testContent, testContext);
  const report = scorer.generateReport(batchScored);
  
  console.log(`\nSummary:`);
  console.log(`  Total Content: ${report.summary.totalContent}`);
  console.log(`  Average Score: ${report.summary.averageScore}/100`);
  console.log(`  Distribution:`);
  Object.entries(report.summary.distribution).forEach(([cat, count]) => {
    console.log(`    • ${cat}: ${count}`);
  });
}

module.exports = ContentQualityScorer;