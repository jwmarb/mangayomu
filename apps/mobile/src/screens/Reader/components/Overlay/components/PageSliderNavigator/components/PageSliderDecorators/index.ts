export { default } from './PageSliderDecorators';
import React from 'react';
import { LayoutChangeEvent } from 'react-native';
import { SimultaneousGesture } from 'react-native-gesture-handler';

export interface PageSliderDecoratorsProps extends React.PropsWithChildren {
  onLayout: (e: LayoutChangeEvent) => void;
  gesture: SimultaneousGesture;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style: any;
  snapPointStyle: Record<string, unknown>;
  trailStyle: Record<string, unknown>[];
}
