import { Color, createTheme, DefaultTheme, Spacing } from '@mangayomu/theme';
import '@emotion/react';
import { css } from '@emotion/native';
import { Theme as AppTheme } from '@emotion/react';
import { helpers } from '@theme/helpers';
import { moderateScale, scale } from 'react-native-size-matters';
import { Theme as NavigationTheme } from '@react-navigation/native';

export type TextVariants = keyof typeof typography;

export const typography = {
  'header-lg': css`
    font-family: Roboto;
    font-size: ${moderateScale(30) + 'px'};
    letter-spacing: -0.19px;
  `,
  header: css`
    font-family: Roboto;
    font-size: ${moderateScale(17) + 'px'};
    letter-spacing: -0.2px;
  `,
  body: css`
    font-family: Roboto;
    font-size: ${moderateScale(14) + 'px'};
    letter-spacing: -0.44px;
  `,
  button: css`
    font-family: Roboto;
    font-size: ${moderateScale(12) + 'px'};
    letter-spacing: -0.44px;
  `,
  'bottom-tab': css`
    font-family: Roboto;
    font-size: ${moderateScale(10) + 'px'};
    letter-spacing: -0.56px;
  `,
  'icon-button': css`
    font-family: Roboto;
    font-size: ${moderateScale(20) + 'px'};
  `,
  badge: css`
    font-family: Roboto;
    font-size: ${moderateScale(10) + 'px'};
    letter-spacing: -0.4px;
  `,
  'book-title': css`
    font-family: Roboto;
    font-size: ${moderateScale(12) + 'px'};
    letter-spacing: -0.4px;
  `,
} as const;

export const shadow = css`
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;

export const spacing = {
  s: moderateScale(8),
  m: moderateScale(16),
  l: moderateScale(24),
  xl: moderateScale(32),
} as const;

declare module '@emotion/react' {
  export interface Theme extends DefaultTheme {
    palette: DefaultTheme['palette'] & {
      skeleton: string;
    };
    typography: typeof typography;
    style: {
      shadow: typeof shadow;
      spacing: typeof spacing;
    } & DefaultTheme['style'];
    __react_navigation__: NavigationTheme;
  }
}

export const __storybook_theme__ = createTheme<AppTheme>(
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
      borderRadius: moderateScale(24),
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
