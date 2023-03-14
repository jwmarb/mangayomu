import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface OverlayProps extends React.PropsWithChildren {
  opacity: SharedValue<number>;
  active: boolean;
}
