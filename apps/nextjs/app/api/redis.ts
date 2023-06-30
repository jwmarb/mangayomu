import { Redis } from 'ioredis';
import env from '@mangayomu/vercel-env';

const redis = new Redis(env().REDIS_URL);

export default redis;
