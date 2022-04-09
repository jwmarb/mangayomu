export interface RGBA {
  red: number;
  green: number;
  blue: number;
  alpha: number;
}

export interface ThemedColorValue<T = string> {
  light: T;
  dark: T;
}
