import { ImageElementProps } from '@screens/Reader/components/ChapterPage/components/ImageElement/ImageElement.interfaces';
import React from 'react';
import { FastImageProps } from 'react-native-fast-image';

export interface FastImageElementProps
  extends Pick<FastImageProps, 'onError' | 'style'> {
  uri: string;
}
