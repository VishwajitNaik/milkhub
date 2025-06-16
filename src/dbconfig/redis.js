import Redis from 'ioredis';

let redisClient;

export function connectRedis() {
  if (!redisClient) {
    const redisUrl = process.env.NODE_ENV === 'production'
    ? process.env.REDIS_URL_PROD
    : process.env.REDIS_URL_DEV;

    console.log('🔍 Using Redis URL:', redisUrl);

    console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("REDIS_URL_PROD:", process.env.REDIS_URL_PROD);
console.log("REDIS_URL_DEV:", process.env.REDIS_URL_DEV);

    redisClient = new Redis(redisUrl, {
      tls: redisUrl.startsWith('rediss') ? { rejectUnauthorized: false } : undefined, // Only for Upstash
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => Math.min(times * 50, 2000), // Exponential backoff
    });

    redisClient.on('connect', () => console.log('✅ Redis connected successfully.'));
    redisClient.on('error', (err) => console.error('❌ Redis connection error:', err));
  }
  return redisClient;
}

const client = connectRedis();

// Function to set a value in Redis
export async function setValue(key, value) {
  try {
    await client.set(key, value);
    console.log(`✅ Redis SET: ${key} = ${value}`);
  } catch (error) {
    console.error('❌ Redis SET failed:', error);
  }
}

// Function to get a value from Redis
export async function getValue(key) {
  try {
    const value = await client.get(key);
    console.log(`✅ Redis GET: ${key} = ${value}`);
    return value;
  } catch (error) {
    console.error('❌ Redis GET failed:', error);
    return null;
  }
}

// Function to check Redis connection
export async function checkRedisConnection() {
  try {
    await client.ping();
    console.log('✅ Redis connection is healthy.');
    return true;
  } catch (error) {
    console.error('❌ Redis connection check failed:', error);
    return false;
  }
}
