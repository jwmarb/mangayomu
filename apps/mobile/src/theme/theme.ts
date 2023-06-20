import { DefaultTheme } from '@mangayomu/theme';
import '@emotion/react';
import { css } from '@emotion/native';
import { moderateScale } from 'react-native-size-matters';
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
  'body-sub': css`
    font-family: Roboto;
    font-size: ${moderateScale(12) + 'px'};
    letter-spacing: -0.4px;
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
      mangaViewerBackButtonColor: string;
      status: {
        ongoing: string;
        discontinued: string;
        hiatus: string;
        completed: string;
      };
      borderColor: string;
      action: {
        ripple: string;
      };
    };
    typography: typeof typography;
    style: {
      shadow: typeof shadow;
      spacing: typeof spacing;
    } & DefaultTheme['style'];
    __react_navigation__: NavigationTheme;
    opposite: Omit<Theme, 'opposite'>;
  }
}
