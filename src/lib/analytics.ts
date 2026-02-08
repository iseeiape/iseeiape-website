/**
 * Analytics tracking utilities
 */

/**
 * Track a click event
 */
export async function trackClick(
  type: 'token_click' | 'wallet_click' | 'general_click',
  target: string,
  source: string = 'unknown'
) {
  try {
    // Only track in production or if explicitly enabled
    if (process.env.NODE_ENV !== 'production' && !process.env.NEXT_PUBLIC_ENABLE_ANALYTICS) {
      return;
    }
    
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type,
        target,
        source,
        timestamp: new Date().toISOString()
      })
    });
    
  } catch (error) {
    // Silently fail - analytics should not break the app
    console.warn('Analytics tracking failed:', error);
  }
}

/**
 * Track token click
 */
export function trackTokenClick(tokenAddress: string, tokenSymbol: string, source: string) {
  return trackClick('token_click', tokenAddress, `${source}:${tokenSymbol}`);
}

/**
 * Track wallet click
 */
export function trackWalletClick(walletAddress: string, walletLabel: string, source: string) {
  return trackClick('wallet_click', walletAddress, `${source}:${walletLabel}`);
}

/**
 * Track general Cielo click
 */
export function trackCieloClick(source: string) {
  return trackClick('general_click', 'cielo_finance', source);
}

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary(days: number = 7) {
  try {
    const response = await fetch(`/api/analytics/track?days=${days}`);
    
    if (!response.ok) {
      throw new Error(`Analytics API failed: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch analytics:', error);
    return null;
  }
}