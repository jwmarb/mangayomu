const REQUIRED_VARS = [
  'REACT_APP_REALM_ID',
  'REDIS_URL',
  'MONGODB_URI',
  'MONGODB_DATABASE_NAME',
  'GOOGLE_OAUTH2_ID',
  'GOOGLE_OAUTH2_SECRET',
  'JWT_SECRET',
  'JWT_EXP_DAYS',
  'BROWSERLESS_API_TOKEN',
];

interface EnvironmentVariables {
  REACT_APP_REALM_ID: string;
  REDIS_URL: string;
  MONGODB_URI: string;
  MONGODB_DATABASE_NAME: string;
  VERCEL_ENV: 'production' | 'development';
  VERCEL_URL: string;
  AUTH_URL: string;
  GOOGLE_OAUTH2_ID: string;
  GOOGLE_OAUTH2_SECRET: string;
  JWT_SECRET: string;
  JWT_EXP_DAYS: string;
  BROWSERLESS_API_TOKEN: string;
}

function generateUrl(environment: 'production' | 'development', host?: string) {
  if (host == null) {
    console.warn('host is undefined. Falling back to localhost:3000...');
    return 'http://localhost:3000/';
  }
  switch (environment) {
    case 'development':
      return `http://${host}`;
    case 'production':
      return `https://${host}`;
  }
}

function generateVariables() {
  const requiredVars = new Set(REQUIRED_VARS);
  const VERCEL_ENV = process.env.VERCEL_ENV as 'production' | 'development';
  const VERCEL_URL = generateUrl(VERCEL_ENV, process.env.VERCEL_URL);
  const UNSAFE_ALLOW_ENVIRONMENT_VARS = process.env
    .UNSAFE_ALLOW_ENVIRONMENT_VARS as boolean | undefined;
  cached = {
    VERCEL_ENV,
    VERCEL_URL,
  } as unknown as EnvironmentVariables;
  for (const [key, value] of Object.entries(process.env)) {
    if (requiredVars.has(key) && key !== 'VERCEL_ENV' && key !== 'VERCEL_URL')
      cached[key as keyof EnvironmentVariables] = value as never;
  }
  if (
    UNSAFE_ALLOW_ENVIRONMENT_VARS === false ||
    UNSAFE_ALLOW_ENVIRONMENT_VARS == null
  )
    for (const key of REQUIRED_VARS) {
      if (key in cached === false)
        throw Error(
          `Missing key "${key}", which is required for the application to run. If you want to run the app without checking for undefined keys, set UNSAFE_ALLOW_ENVIRONMENT_VARS=true in .env.local; The value of this in process.env is ${process.env[key]}`,
        );
    }
  else if (VERCEL_ENV === 'development')
    console.warn(
      "Using UNSAFE_ALLOW_ENVIRONMENT_VARS will allow undefined environment variables to be processed during runtime. Unless you know what you're doing, this should be set to false or removed completely",
    );

  return cached;
}

let cached: EnvironmentVariables | undefined = undefined;

export default function env() {
  return cached ?? generateVariables();
}
