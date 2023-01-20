import { createTheme, DefaultTheme } from '@mangayomu/theme';
import '@emotion/react';
import { css } from '@emotion/native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Theme } from '@emotion/react';
import { helpers } from '@theme/helpers';

export type TextVariants = keyof typeof typography;

export const typography = {
  header: css`
    font-family: Roboto;
    font-size: 20px;
    letter-spacing: -0.2px;
  `,
  body: css`
    font-family: Roboto;
    font-size: 13px;
    letter-spacing: -0.44px;
  `,
  button: css`
    font-family: Roboto;
    font-size: 12px;
    letter-spacing: -0.44px;
  `,
  'bottom-tab': css`
    font-family: Roboto;
    font-size: 10px;
    letter-spacing: -0.56px;
  `,
} as const;

export const shadow = () => css`
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

declare module '@emotion/react' {
  export interface Theme extends DefaultTheme {
    typography: typeof typography;
    style: {
      shadow: typeof shadow;
    } & DefaultTheme['style'];
  }
}

export const __storybook_theme__ = createTheme<Theme>(
  ({ color, colorConstant }) => ({
    mode: 'dark',
    palette: {
      primary: {
        light: colorConstant('#69c0ff'),
        main: colorConstant('#1890ff'),
        dark: colorConstant('#0050b3'),
      },
      secondary: {
        light: colorConstant('#ffa39e'),
        main: colorConstant('#ff7875'),
        dark: colorConstant('#ff4d4f'),
      },
      text: {
        primary: color('rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0.87)'),
        secondary: color('rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.6)'),
        disabled: color('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.38)'),
        hint: color('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.38)'),
      },
      background: {
        default: color('#141414', '#fafafa'),
        paper: color('#262626', '#ffffff'),
      },
    },
    style: {
      shadow,
      borderRadius: RFValue(24),
      spacing: {
        s: 2,
        m: 6,
        l: 10,
        xl: 16,
      },
    },
    typography,
    helpers,
  }),
);
