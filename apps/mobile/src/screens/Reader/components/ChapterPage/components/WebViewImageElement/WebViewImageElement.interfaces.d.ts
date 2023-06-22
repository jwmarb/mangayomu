import React from 'react';
import { WebViewProps } from 'react-native-webview';

export interface WebViewImageElementProps
  extends Pick<WebViewProps, 'onMessage'> {
  uri: string;
  style: {
    width: number;
    height: number;
  };
}
