const REQUIRED_VARS = [
  'REACT_APP_REALM_ID',
  'REDIS_URL',
  'MONGODB_URL',
  'GOOGLE_OAUTH2_ID',
  'GOOGLE_OAUTH2_SECRET',
];

interface EnvironmentVariables {
  REACT_APP_REALM_ID: string;
  REDIS_URL: string;
  MONGODB_URL: string;
  VERCEL_ENV: 'production' | 'development';
  VERCEL_URL: URL;
  GOOGLE_OAUTH2_ID: string;
  GOOGLE_OAUTH2_SECRET: string;
}

export class UrlBuildParse extends URL {
  public constructor(url: string) {
    super(url);
  }
  public static from(url: string): UrlBuildParse {
    return new UrlBuildParse(url);
  }
  public join(...routes: string[]) {
    this.pathname = routes.join('/');
  }
  public clone(): UrlBuildParse {
    return new UrlBuildParse(super.toString());
  }
  public static clone(self: UrlBuildParse): UrlBuildParse {
    return new UrlBuildParse(self.toString());
  }
}

function generateUrl(environment: 'production' | 'development', host?: string) {
  if (host == null) throw Error('Unknown host');
  switch (environment) {
    case 'development':
      return new UrlBuildParse(`http://${host}`);
    case 'production':
      return new UrlBuildParse(`https://${host}`);
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
      cached[key as keyof EnvironmentVariables] = value as any;
  }
  if (
    UNSAFE_ALLOW_ENVIRONMENT_VARS === false ||
    UNSAFE_ALLOW_ENVIRONMENT_VARS == null
  )
    for (const key of REQUIRED_VARS) {
      if (key in cached === false)
        throw Error(
          `Missing key "${key}", which is required for the application to run. If you want to run the app without checking for undefined keys, set UNSAFE_ALLOW_ENVIRONMENT_VARS=true in .env.local`,
        );
    }
  else if (VERCEL_ENV === 'development')
    console.warn(
      `Using UNSAFE_ALLOW_ENVIRONMENT_VARS will allow undefined environment variables to be processed during runtime. Unless you know what you're doing, this should be set to false or removed completely`,
    );

  return cached;
}

let cached: EnvironmentVariables | undefined = undefined;

export default function env() {
  return cached ?? generateVariables();
}
