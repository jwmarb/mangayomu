import { Theme } from '@emotion/react';
import { Color, Colors, DefaultTheme } from '@mangayomu/theme';

export const helpers = {
  spacing: (spacingOption: keyof DefaultTheme['style']['spacing']) => {
    return (theme: Theme) => {
      return theme.style.spacing[spacingOption];
    };
  },
  getRippleColor: (color: Colors) => {
    return (theme: Theme) => {
      switch (typeof color) {
        case 'string':
          if (
            color in theme.palette &&
            typeof theme.palette[color as keyof typeof theme.palette] ===
              'object' &&
            color != null
          ) {
            const key = color as keyof {
              [K in keyof typeof theme.palette as (typeof theme.palette)[K] extends object
                ? K
                : never]: (typeof theme.palette)[K];
            };
            if ('ripple' in theme.palette[key])
              return (theme.palette[key] as Color).ripple;
          }
          return theme.palette.action.ripple;
        default:
          return theme.palette.action.ripple;
      }
    };
  },
} as const;

type BaseHelpers = typeof helpers;

export type Helpers = {
  [K in keyof BaseHelpers]: (
    ...args: Parameters<BaseHelpers[K]>
  ) => ReturnType<ReturnType<BaseHelpers[K]>>;
};
