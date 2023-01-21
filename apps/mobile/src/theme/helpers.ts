import { Theme } from '@emotion/react';
import { DefaultTheme } from '@mangayomu/theme';

export const helpers = {
  spacing: (spacingOption: keyof DefaultTheme['style']['spacing']) => {
    return (theme: Theme) => {
      return theme.style.spacing[spacingOption];
    };
  },
} as const;

type BaseHelpers = typeof helpers;

export type Helpers = {
  [K in keyof BaseHelpers]: (
    ...args: Parameters<BaseHelpers[K]>
  ) => ReturnType<ReturnType<BaseHelpers[K]>>;
};
