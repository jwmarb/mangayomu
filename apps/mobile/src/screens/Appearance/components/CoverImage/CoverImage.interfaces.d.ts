import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface CoverImageProps extends React.PropsWithChildren {
  width: SharedValue<number>;
  height: SharedValue<number>;
  onChangeWidth: (val: number) => void;
  onChangeHeight: (val: number) => void;
  onToggleAutoHeight: () => void;
  autoHeight: boolean;
}
