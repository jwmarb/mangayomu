const REQUIRED_VARS = [
  'REACT_APP_REALM_ID',
  'REDIS_URL',
  'MONGODB_URI',
  'MONGODB_DATABASE_NAME',
  'GOOGLE_OAUTH2_ID',
  'GOOGLE_OAUTH2_SECRET',
  'JWT_SECRET',
  'JWT_EXP_DAYS',
];

interface EnvironmentVariables {
  REACT_APP_REALM_ID: string;
  REDIS_URL: string;
  MONGODB_URI: string;
  MONGODB_DATABASE_NAME: string;
  VERCEL_ENV: 'production' | 'development';
  VERCEL_URL: UrlBuildParse;
  AUTH_URL: AuthUrl;
  GOOGLE_OAUTH2_ID: string;
  GOOGLE_OAUTH2_SECRET: string;
  JWT_SECRET: string;
  JWT_EXP_DAYS: string;
}

export class AuthUrl {
  private url: UrlBuildParse;
  private providers: Map<string, string>;
  public constructor(url: UrlBuildParse) {
    this.url = new UrlBuildParse(url.toString()).join('api', 'v1', 'oauth2');
    this.providers = new Map();
  }
  public provider(provider: string) {
    const val = this.providers.get(provider);
    if (val == null) {
      const cloned = this.url.clone().join(provider).toString();
      this.providers.set(provider, cloned);
      return cloned;
    }
    return val;
  }
  public getProviders() {
    return this.providers.keys();
  }
}

export class UrlBuildParse {
  private url: URL;
  public constructor(url: string) {
    this.url = new URL(url);
  }
  public join(...routes: string[]) {
    this.url.pathname =
      this.url.pathname +
      (this.url.pathname.endsWith('/') ? '' : '/') +
      routes.join('/');

    return this;
  }
  public clone(): UrlBuildParse {
    return new UrlBuildParse(this.url.toString());
  }
  public static clone(self: UrlBuildParse): UrlBuildParse {
    return new UrlBuildParse(self.toString());
  }

  public get host() {
    return this.url.host;
  }

  public unjoin() {
    const paths = this.url.pathname.split('/');
    paths.pop();
    this.url.pathname = paths.join('/');
    return this;
  }

  public isSSL() {
    return this.url.protocol === 'https:';
  }

  public set protocol(set: string) {
    this.url.protocol = set;
  }
  public get protocol() {
    return this.url.protocol;
  }

  public query(args: Record<string, unknown>) {
    for (const key in args) {
      this.url.searchParams.append(key, String(args[key]));
    }
    return this;
  }

  public toString() {
    return this.url.toString();
  }
}

function generateUrl(environment: 'production' | 'development', host?: string) {
  if (host == null) {
    console.warn('host is undefined. Falling back to localhost:3000...');
    return new UrlBuildParse('http://localhost:3000/');
  }
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
    AUTH_URL: new AuthUrl(VERCEL_URL),
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
