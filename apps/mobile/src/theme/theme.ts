import { DefaultTheme } from '@mangayomu/theme';
import '@emotion/react';
import { css } from '@emotion/native';
import { RFValue } from 'react-native-responsive-fontsize';

export type TextVariants = keyof typeof typography;

export const typography = {
  header: css`
    font-family: Roboto;
    font-size: ${RFValue(20)}px;
    letter-spacing: -0.2px;
  `,
  body: css`
    font-family: Roboto;
    font-size: ${RFValue(13)}px;
    letter-spacing: -0.44px;
  `,
  button: css`
    font-family: Roboto;
    font-size: ${RFValue(12)}px;
    letter-spacing: -0.44px;
  `,
  'bottom-tab': css`
    font-family: Roboto;
    font-size: ${RFValue(10)}px;
    letter-spacing: -0.56px;
  `,
} as const;

declare module '@emotion/react' {
  export interface Theme extends DefaultTheme {
    typography: typeof typography;
  }
}
