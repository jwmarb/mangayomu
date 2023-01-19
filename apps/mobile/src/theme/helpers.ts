import { Theme } from '@emotion/react';
import { DefaultTheme } from '@mangayomu/theme';
import { RFValue } from 'react-native-responsive-fontsize';

export const helpers = {
  rem: (units: number, outType: 'string' | 'number') => {
    return () => {
      if (outType === 'string') return `${RFValue(units)}px`;
      return RFValue(units);
    };
  },
  spacing: (spacingOption: keyof DefaultTheme['style']['spacing']) => {
    return (theme: Theme) => {
      return theme.style.spacing[spacingOption];
    };
  },
} as const;

export type Helpers = typeof helpers;
