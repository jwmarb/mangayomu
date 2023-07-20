import usePageRenderer from '@screens/Reader/components/ChapterPage/hooks/usePageRenderer';
import React from 'react';
import { ViewProps } from 'react-native';

export interface ImageErrorRendererProps {
  pageKey: string;
  onReload: () => void;
  style: Parameters<typeof usePageRenderer>[0]['style'];
}
