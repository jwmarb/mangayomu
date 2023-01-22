import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface PaginationCircleProps extends React.PropsWithChildren {
  index: number;
  scrollPosition: SharedValue<number>;
}
