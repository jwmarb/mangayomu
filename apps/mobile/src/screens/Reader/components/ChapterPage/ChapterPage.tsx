import React from 'react';
import { useWindowDimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ChapterPageProps } from './ChapterPage.interfaces';
import WebView from 'react-native-webview';
import Box from '@components/Box';
import Text from '@components/Text';

const ChapterPage: React.FC<ChapterPageProps> = (props) => {
  const { width, height } = useWindowDimensions();
  const style = { width, height };
  const { page } = props.page;
  return (
    <FastImage source={{ uri: '' }} style={style} resizeMode="contain">
      <Text>Loading...</Text>
    </FastImage>
  );
};

export default React.memo(ChapterPage);
