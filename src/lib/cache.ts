/**
 * Simple in-memory cache for API responses
 * Reduces external API calls and improves response times
 */

interface CacheEntry {
  data: any;
  timestamp: number;
  expiresAt: number;
}

class MemoryCache {
  private cache: Map<string, CacheEntry> = new Map();
  private defaultTTL: number = 60000; // 1 minute default

  /**
   * Set a value in cache
   */
  set(key: string, data: any, ttlMs?: number): void {
    const now = Date.now();
    const ttl = ttlMs || this.defaultTTL;
    
    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + ttl
    });
    
    // Clean up expired entries occasionally
    if (this.cache.size > 1000) {
      this.cleanup();
    }
  }

  /**
   * Get a value from cache
   */
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Delete a key from cache
   */
  delete(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache stats
   */
  stats(): { size: number; hits: number; misses: number } {
    return {
      size: this.cache.size,
      hits: 0, // Would need to track hits/misses
      misses: 0
    };
  }

  /**
   * Clean up expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

// Singleton cache instance
const cache = new MemoryCache();

/**
 * Cache decorator for API functions
 */
export function cached(ttlMs: number = 60000) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      // Create cache key from function name and arguments
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;
      
      // Try to get from cache
      const cachedResult = cache.get(cacheKey);
      if (cachedResult !== null) {
        return cachedResult;
      }
      
      // Call original method
      const result = await originalMethod.apply(this, args);
      
      // Store in cache
      cache.set(cacheKey, result, ttlMs);
      
      return result;
    };
    
    return descriptor;
  };
}

/**
 * Cache API responses with fetch
 */
export async function cachedFetch(
  url: string, 
  options?: RequestInit, 
  ttlMs: number = 60000
): Promise<any> {
  const cacheKey = `fetch:${url}:${JSON.stringify(options || {})}`;
  
  // Try cache first
  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }
  
  // Fetch from network
  const response = await fetch(url, options);
  const data = await response.json();
  
  // Cache the result
  cache.set(cacheKey, data, ttlMs);
  
  return data;
}

/**
 * Clear cache for a specific pattern
 */
export function clearCache(pattern: string): number {
  let cleared = 0;
  
  // Simple pattern matching (startsWith)
  for (const key of Array.from(cache['cache'].keys())) {
    if (key.startsWith(pattern)) {
      cache.delete(key);
      cleared++;
    }
  }
  
  return cleared;
}

/**
 * Get cache instance (for advanced use)
 */
export function getCache(): MemoryCache {
  return cache;
}

export default cache;