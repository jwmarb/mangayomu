import { Collapsible } from 'react-navigation-collapsible';
import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import React from 'react';

export interface RecyclerListViewScrollViewProps {
  header: React.ReactElement<any>;
  collapsible: Collapsible;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  // onAnimatedScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  // containerPaddingTop: number;
  // scrollIndicatorInsetTop: number;
}
