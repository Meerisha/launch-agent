#!/usr/bin/env node
import { Redis } from '@upstash/redis';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

async function testRedisConnection() {
  console.log('🔄 Testing Upstash Redis connection...\n');

  try {
    // Test 1: Basic connection
    console.log('1. Testing basic connection...');
    const pingResult = await redis.ping();
    console.log('   ✅ Ping result:', pingResult);

    // Test 2: Set and get data
    console.log('2. Testing set/get operations...');
    const testKey = 'test:connection';
    const testValue = { message: 'Hello Redis!', timestamp: Date.now() };
    
    await redis.set(testKey, JSON.stringify(testValue));
    console.log('   ✅ Set test data');

    const retrievedValue = await redis.get(testKey);
    console.log('   ✅ Retrieved test data:', retrievedValue);

    // Test 3: Set with expiration
    console.log('3. Testing TTL operations...');
    await redis.setex('test:ttl', 10, 'expires in 10 seconds');
    const ttl = await redis.ttl('test:ttl');
    console.log('   ✅ TTL test:', ttl, 'seconds remaining');

    // Test 4: Database size
    console.log('4. Testing database stats...');
    const dbSize = await redis.dbsize();
    console.log('   ✅ Database size:', dbSize, 'keys');

    // Test 5: List keys
    console.log('5. Testing key listing...');
    const keys = await redis.keys('test:*');
    console.log('   ✅ Test keys found:', keys);

    // Test 6: Cache simulation
    console.log('6. Testing cache simulation...');
    const cacheKey = 'cache:test-project';
    const cacheData = {
      projectName: 'Test Project',
      marketSize: '$1B',
      competitors: ['Competitor A', 'Competitor B'],
      cachedAt: new Date().toISOString()
    };
    
    await redis.setex(cacheKey, 3600, JSON.stringify(cacheData)); // 1 hour TTL
    const cachedResult = await redis.get(cacheKey);
    console.log('   ✅ Cache simulation successful');
    console.log('   📊 Cached data:', typeof cachedResult === 'string' ? JSON.parse(cachedResult) : cachedResult);

    // Cleanup
    console.log('7. Cleaning up test data...');
    await redis.del(testKey);
    await redis.del('test:ttl');
    await redis.del(cacheKey);
    console.log('   ✅ Cleanup complete');

    console.log('\n🎉 All Redis tests passed!');
    console.log('✅ Upstash Redis is properly configured and working');

  } catch (error) {
    console.error('❌ Redis connection failed:', error.message);
    
    if (error.message.includes('UNAUTHORIZED')) {
      console.error('🔑 Check your UPSTASH_REDIS_REST_TOKEN');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Check your UPSTASH_REDIS_REST_URL');
    }
    
    console.error('\n📝 Make sure your .env.local file contains:');
    console.error('   UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io');
    console.error('   UPSTASH_REDIS_REST_TOKEN=your-token-here');
    
    process.exit(1);
  }
}

testRedisConnection(); 