export { default } from './ImageBaseRenderer';
import React from 'react';
import { FastImageElementProps } from '@screens/Reader/components/ChapterPage/components/FastImageElement/FastImageElement.interfaces';
import { ImageElementProps } from '@screens/Reader/components/ChapterPage/components/ImageElement/ImageElement.interfaces';
import { WebViewImageElementProps } from '@screens/Reader/components/ChapterPage/components/WebViewImageElement/WebViewImageElement.interfaces';
import usePageRenderer from '@screens/Reader/components/ChapterPage/hooks/usePageRenderer';

export interface ImageBaseRendererProps
  extends Omit<WebViewImageElementProps, 'animatedStyle' | 'style'>,
    Omit<ImageElementProps, 'onError' | 'style'>,
    Omit<FastImageElementProps, 'style'> {
  error?: string;
  fallbackToWebView: boolean;
  style: Parameters<typeof usePageRenderer>[1];
}
