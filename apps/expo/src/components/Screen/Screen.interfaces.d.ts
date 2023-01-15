import React from 'react';
import { ScrollViewProps } from 'react-native';
import { Collapsible, UseCollapsibleOptions } from 'react-navigation-collapsible';

export interface ScreenProps extends React.PropsWithChildren {
  scrollable?: boolean | UseCollapsibleOptions;
  scrollViewProps?: ScrollViewProps;
  collapsible?: Collapsible;
}
