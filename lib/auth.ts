import { Redis } from '@upstash/redis';
import crypto from 'crypto';

// In-memory store for demo (replace with Redis/DB in production)
const users = new Map();
const apiKeys = new Map();
const rateLimits = new Map();

interface User {
  id: string;
  email: string;
  tier: 'free' | 'premium' | 'pro';
  apiKey?: string;
  createdAt: Date;
  subscriptionEndsAt?: Date;
  monthlyRequests: number;
  requestsThisMonth: number;
}

interface RateLimit {
  limit: number;
  remaining: number;
  reset: number;
}

// Initialize demo users
function initializeDemoUsers() {
  // Free tier user
  const freeUser: User = {
    id: 'user_123',
    email: 'free@example.com',
    tier: 'free',
    apiKey: 'free_apikey_123',
    createdAt: new Date(),
    monthlyRequests: 1000,
    requestsThisMonth: 450
  };
  
  // Premium tier user
  const premiumUser: User = {
    id: 'user_456',
    email: 'premium@example.com',
    tier: 'premium',
    apiKey: 'premium_apikey_456',
    createdAt: new Date(),
    subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    monthlyRequests: 10000,
    requestsThisMonth: 3200
  };
  
  // Pro tier user
  const proUser: User = {
    id: 'user_789',
    email: 'pro@example.com',
    tier: 'pro',
    apiKey: 'pro_apikey_789',
    createdAt: new Date(),
    subscriptionEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    monthlyRequests: 100000,
    requestsThisMonth: 12500
  };
  
  users.set(freeUser.id, freeUser);
  users.set(premiumUser.id, premiumUser);
  users.set(proUser.id, proUser);
  
  apiKeys.set(freeUser.apiKey!, freeUser.id);
  apiKeys.set(premiumUser.apiKey!, premiumUser.id);
  apiKeys.set(proUser.apiKey!, proUser.id);
}

// Call initialization
initializeDemoUsers();

export async function verifyApiKey(apiKey: string): Promise<User | null> {
  const userId = apiKeys.get(apiKey);
  if (!userId) return null;
  
  const user = users.get(userId);
  if (!user) return null;
  
  // Check if subscription is still valid for paid tiers
  if (user.tier !== 'free' && user.subscriptionEndsAt && user.subscriptionEndsAt < new Date()) {
    // Downgrade to free tier
    user.tier = 'free';
    user.monthlyRequests = 1000;
    users.set(user.id, user);
  }
  
  return user;
}

export async function checkRateLimit(userId: string, tier: string): Promise<{
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfter?: number;
}> {
  const user = users.get(userId);
  if (!user) {
    return {
      allowed: false,
      limit: 0,
      remaining: 0,
      retryAfter: 60
    };
  }
  
  const now = Date.now();
  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);
  
  // Reset monthly counter if new month
  if (user.createdAt < monthStart) {
    user.requestsThisMonth = 0;
    users.set(user.id, user);
  }
  
  // Check monthly limit
  if (user.requestsThisMonth >= user.monthlyRequests) {
    return {
      allowed: false,
      limit: user.monthlyRequests,
      remaining: 0,
      retryAfter: Math.ceil((new Date(monthStart.getTime() + 30 * 24 * 60 * 60 * 1000).getTime() - now) / 1000)
    };
  }
  
  // Check per-minute rate limit based on tier
  const minuteKey = `rate:${userId}:${Math.floor(now / 60000)}`;
  const currentCount = rateLimits.get(minuteKey) || 0;
  
  let minuteLimit: number;
  switch (tier) {
    case 'free':
      minuteLimit = 10; // 10 requests per minute
      break;
    case 'premium':
      minuteLimit = 60; // 60 requests per minute
      break;
    case 'pro':
      minuteLimit = 300; // 300 requests per minute
      break;
    default:
      minuteLimit = 10;
  }
  
  if (currentCount >= minuteLimit) {
    return {
      allowed: false,
      limit: minuteLimit,
      remaining: 0,
      retryAfter: 60 - Math.floor((now % 60000) / 1000)
    };
  }
  
  // Update counters
  rateLimits.set(minuteKey, currentCount + 1);
  user.requestsThisMonth += 1;
  users.set(user.id, user);
  
  return {
    allowed: true,
    limit: minuteLimit,
    remaining: minuteLimit - (currentCount + 1)
  };
}

export async function getUserTier(userId: string): Promise<string> {
  const user = users.get(userId);
  return user?.tier || 'free';
}

export async function createApiKey(userId: string): Promise<string> {
  const user = users.get(userId);
  if (!user) throw new Error('User not found');
  
  // Generate new API key
  const apiKey = `iseeiape_${crypto.randomBytes(24).toString('hex')}`;
  
  // Update user
  user.apiKey = apiKey;
  users.set(user.id, user);
  apiKeys.set(apiKey, user.id);
  
  return apiKey;
}

export async function upgradeUserTier(userId: string, newTier: 'premium' | 'pro'): Promise<User> {
  const user = users.get(userId);
  if (!user) throw new Error('User not found');
  
  // Update tier and limits
  user.tier = newTier;
  user.subscriptionEndsAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
  
  switch (newTier) {
    case 'premium':
      user.monthlyRequests = 10000;
      break;
    case 'pro':
      user.monthlyRequests = 100000;
      break;
  }
  
  users.set(user.id, user);
  return user;
}

export async function getUsageStats(userId: string) {
  const user = users.get(userId);
  if (!user) return null;
  
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysPassed = now.getDate();
  
  return {
    tier: user.tier,
    monthlyRequests: user.monthlyRequests,
    requestsThisMonth: user.requestsThisMonth,
    requestsRemaining: user.monthlyRequests - user.requestsThisMonth,
    dailyAverage: Math.round(user.requestsThisMonth / daysPassed),
    projectedEndOfMonth: Math.round(user.requestsThisMonth / daysPassed * daysInMonth),
    subscriptionEndsAt: user.subscriptionEndsAt,
    isActive: !user.subscriptionEndsAt || user.subscriptionEndsAt > now
  };
}