// lib/cache.js - In-memory caching system for API responses
const NodeCache = require('node-cache');

class APICache {
  constructor() {
    this.cache = new NodeCache({
      stdTTL: 30, // 30 seconds default TTL
      checkperiod: 60, // Check for expired keys every 60 seconds
      useClones: false // Better performance for large objects
    });
    
    this.stats = {
      hits: 0,
      misses: 0,
      sets: 0,
      deletes: 0
    };
  }

  /**
   * Get cached data by key
   */
  get(key) {
    const data = this.cache.get(key);
    if (data !== undefined) {
      this.stats.hits++;
      return data;
    }
    this.stats.misses++;
    return null;
  }

  /**
   * Set data in cache
   */
  set(key, data, ttl = 30) {
    this.cache.set(key, data, ttl);
    this.stats.sets++;
    return true;
  }

  /**
   * Delete cached data
   */
  del(key) {
    const deleted = this.cache.del(key);
    if (deleted > 0) {
      this.stats.deletes++;
    }
    return deleted;
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const keys = this.cache.keys();
    return {
      ...this.stats,
      totalKeys: keys.length,
      hitRate: this.stats.hits + this.stats.misses > 0 
        ? (this.stats.hits / (this.stats.hits + this.stats.misses) * 100).toFixed(2) + '%'
        : '0%',
      memoryUsage: process.memoryUsage().heapUsed / 1024 / 1024
    };
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.flushAll();
    return true;
  }

  /**
   * Get cache keys with TTL
   */
  getKeys() {
    const keys = this.cache.keys();
    return keys.map(key => ({
      key,
      ttl: this.cache.getTtl(key)
    }));
  }
}

// Singleton instance
const cache = new APICache();

module.exports = cache;