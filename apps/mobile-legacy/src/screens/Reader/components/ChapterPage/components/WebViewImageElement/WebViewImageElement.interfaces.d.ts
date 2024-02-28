import usePageRenderer from '@screens/Reader/components/ChapterPage/hooks/usePageRenderer';
import React from 'react';
import Animated from 'react-native-reanimated';
import { WebViewProps } from 'react-native-webview';

export interface WebViewImageElementProps
  extends Pick<WebViewProps, 'onMessage'> {
  uri: string;
  style: { width: number; height: number };
  animatedStyle: Parameters<typeof usePageRenderer>[0]['style'];
}
