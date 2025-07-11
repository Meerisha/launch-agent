import { Redis } from '@upstash/redis';

// Initialize Redis client with environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Cache keys
const CACHE_KEYS = {
  MARKET_RESEARCH: (projectName: string) => `market:${projectName.toLowerCase().replace(/\s+/g, '-')}`,
  COMPETITOR_ANALYSIS: (projectName: string) => `competitor:${projectName.toLowerCase().replace(/\s+/g, '-')}`,
  TREND_ANALYSIS: (projectName: string) => `trends:${projectName.toLowerCase().replace(/\s+/g, '-')}`,
} as const;

// Cache TTL (24 hours)
const CACHE_TTL = 24 * 60 * 60; // 24 hours in seconds

export interface CacheOptions {
  ttl?: number;
  skipCache?: boolean;
}

/**
 * Get cached data from Redis
 */
export async function getCachedData<T>(key: string): Promise<T | null> {
  try {
    const data = await redis.get(key);
    return data as T | null;
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
}

/**
 * Set cached data in Redis
 */
export async function setCachedData<T>(
  key: string, 
  data: T, 
  options: CacheOptions = {}
): Promise<void> {
  try {
    const ttl = options.ttl || CACHE_TTL;
    await redis.setex(key, ttl, JSON.stringify(data));
  } catch (error) {
    console.error('Redis SET error:', error);
  }
}

/**
 * Cache market research data
 */
export async function cacheMarketResearch(
  projectName: string, 
  data: any,
  options: CacheOptions = {}
): Promise<void> {
  const key = CACHE_KEYS.MARKET_RESEARCH(projectName);
  await setCachedData(key, data, options);
}

/**
 * Get cached market research data
 */
export async function getCachedMarketResearch(projectName: string): Promise<any | null> {
  const key = CACHE_KEYS.MARKET_RESEARCH(projectName);
  return await getCachedData(key);
}

/**
 * Cache competitor analysis data
 */
export async function cacheCompetitorAnalysis(
  projectName: string, 
  data: any,
  options: CacheOptions = {}
): Promise<void> {
  const key = CACHE_KEYS.COMPETITOR_ANALYSIS(projectName);
  await setCachedData(key, data, options);
}

/**
 * Get cached competitor analysis data
 */
export async function getCachedCompetitorAnalysis(projectName: string): Promise<any | null> {
  const key = CACHE_KEYS.COMPETITOR_ANALYSIS(projectName);
  return await getCachedData(key);
}

/**
 * Cache trend analysis data
 */
export async function cacheTrendAnalysis(
  projectName: string, 
  data: any,
  options: CacheOptions = {}
): Promise<void> {
  const key = CACHE_KEYS.TREND_ANALYSIS(projectName);
  await setCachedData(key, data, options);
}

/**
 * Get cached trend analysis data
 */
export async function getCachedTrendAnalysis(projectName: string): Promise<any | null> {
  const key = CACHE_KEYS.TREND_ANALYSIS(projectName);
  return await getCachedData(key);
}

/**
 * Test Redis connection
 */
export async function testRedisConnection(): Promise<boolean> {
  try {
    const result = await redis.ping();
    console.log('✅ Redis connection successful:', result);
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return false;
  }
}

/**
 * Clear all cached data for a project
 */
export async function clearProjectCache(projectName: string): Promise<void> {
  try {
    const keys = [
      CACHE_KEYS.MARKET_RESEARCH(projectName),
      CACHE_KEYS.COMPETITOR_ANALYSIS(projectName),
      CACHE_KEYS.TREND_ANALYSIS(projectName)
    ];
    
    await Promise.all(keys.map(key => redis.del(key)));
    console.log(`✅ Cleared cache for project: ${projectName}`);
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
  }
}

/**
 * Get cache stats
 */
export async function getCacheStats(): Promise<{
  totalKeys: number;
  memoryUsage: string;
}> {
  try {
    const keys = await redis.dbsize();
    
    return {
      totalKeys: keys,
      memoryUsage: 'Available via Upstash Console'
    };
  } catch (error) {
    console.error('❌ Error getting cache stats:', error);
    return {
      totalKeys: 0,
      memoryUsage: 'Unknown'
    };
  }
}

export { redis }; 