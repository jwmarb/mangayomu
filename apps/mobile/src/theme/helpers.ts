import { RFValue } from 'react-native-responsive-fontsize';

export const helpers = {
  rem: (units: number, outType: 'string' | 'number') => {
    return () => {
      if (outType === 'string') return `${RFValue(units)}px`;
      return RFValue(units);
    };
  },
} as const;

export type Helpers = typeof helpers;
