declare module '@env' {
  export const REACT_APP_REALM_ID: string;
  export const BACKEND_DOMAIN: string;
  export const GOOGLE_OAUTH2_ID: string;
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
