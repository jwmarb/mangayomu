import React from 'react';
import { FastImageElementProps } from '@screens/Reader/components/ChapterPage/components/FastImageElement/FastImageElement.interfaces';
import { ImageElementProps } from '@screens/Reader/components/ChapterPage/components/ImageElement/ImageElement.interfaces';
import { WebViewImageElementProps } from '@screens/Reader/components/ChapterPage/components/WebViewImageElement/WebViewImageElement.interfaces';

export interface ImageBaseRendererProps
  extends WebViewImageElementProps,
    ImageElementProps,
    FastImageElementProps {
  error?: string;
  fallbackToWebView: boolean;
  style: readonly [
    {
      transform: {
        scale: number;
      }[];
    },
    {
      readonly width: number;
      readonly height: number;
    },
  ];
}
