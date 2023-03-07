import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface LetterSpacingProps extends React.PropsWithChildren {
  autoLetterSpacing: boolean;
  letterSpacing: SharedValue<number>;
  onToggleAutoLetterSpacing: () => void;
  onChangeLetterSpacing: (val: number) => void;
}
