declare global {
  namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_REALM_ID: string;
      REDIS_URL: string;
      MONGODB_URL: string;
      VERCEL_ENV: 'production' | 'development';
    }
  }
}
