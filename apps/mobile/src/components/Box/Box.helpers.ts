import { css, ReactNativeStyle } from '@emotion/native';

export function set<T>(
  propertyName: string,
  input?: T,
): (() => ReactNativeStyle) | undefined {
  if (input != null)
    return () => css`
      ${propertyName}: ${input};
    `;
}

export function setu<T>(
  propertyName: string,
  input?: T,
): (() => ReactNativeStyle) | undefined {
  if (input != null)
    return () => css`
      ${propertyName}: ${input}px;
    `;
}

export function setwandh(
  propertyName: 'width' | 'height',
  widthOrHeightValue: string | number,
): (() => ReactNativeStyle) | undefined {
  switch (typeof widthOrHeightValue) {
    case 'number':
      return () => css`
        ${propertyName}: ${widthOrHeightValue}px;
      `;
    case 'string':
      return () => css`
        ${propertyName}: ${widthOrHeightValue};
      `;
    default:
      throw Error('Invalid widthOrHeightValue passed in args');
  }
}
