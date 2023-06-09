declare module '@env' {
  export const REACT_APP_REALM_ID: string;
}

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
