import React from 'react';
import { ImageProps } from 'react-native';

export interface ImageElementProps
  extends Pick<ImageProps, 'style' | 'onError'> {
  uri: string;
}
