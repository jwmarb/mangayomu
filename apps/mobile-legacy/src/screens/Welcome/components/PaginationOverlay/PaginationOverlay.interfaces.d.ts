import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface PaginationOverlayProps extends React.PropsWithChildren {
  scrollPosition: SharedValue<number>;
}
