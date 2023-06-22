import React from 'react';
import { ViewProps } from 'react-native';

export interface ImageErrorRendererProps extends Pick<ViewProps, 'style'> {
  pageKey: string;
  onReload: () => void;
}
