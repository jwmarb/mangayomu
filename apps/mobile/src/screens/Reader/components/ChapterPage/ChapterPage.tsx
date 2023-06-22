import React from 'react';
import { Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { ChapterPageContextState } from './ChapterPage.interfaces';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import Box, { AnimatedBox } from '@components/Box';
import Text from '@components/Text';
import { runOnJS } from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import connector, { ConnectedChapterPageProps } from './ChapterPage.redux';
import Icon from '@components/Icon';
import { moderateScale } from 'react-native-size-matters';
import Stack from '@components/Stack';
import Hyperlink from '@components/Hyperlink';
import Button from '@components/Button';
import { useLocalRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { ReaderImageComponent, ReadingDirection } from '@redux/slices/settings';
import { useIsFocused } from '@react-navigation/native';
import useScreenDimensions from '@hooks/useScreenDimensions';
import RNFetchBlob from 'rn-fetch-blob';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import usePageGestures from '@screens/Reader/components/ChapterPage/hooks/usePageGestures';
import usePageRenderer from '@screens/Reader/components/ChapterPage/hooks/usePageRenderer';
import usePageDownloader from '@screens/Reader/components/ChapterPage/hooks/usePageDownloader';

const ChapterPage: React.FC<ConnectedChapterPageProps> = (props) => {
  const { readingDirection } = useChapterPageContext();
  const { width, height } = useScreenDimensions();
  const { page: pageKey, chapter, pageNumber } = props.page;
  const { extendedPageState, backgroundColor } = props;
  const gestures = usePageGestures();
  const imageWidth = props.page.width;
  const imageHeight = props.page.height;
  const scale = width / imageWidth;
  const stylizedHeight = ReadingDirection.WEBTOON
    ? scale * imageHeight
    : height;
  const style = React.useMemo(
    () => ({
      width,
      height: stylizedHeight,
    }),
    [width, stylizedHeight],
  );
  const PageRenderer = usePageRenderer({
    extendedPageState,
    pageKey,
    style,
    stylizedHeight,
  });
  usePageDownloader({ chapter, extendedPageState, pageKey, pageNumber });

  return (
    <Box
      flex-grow
      background-color={backgroundColor}
      justify-content="center"
      align-items="center"
      height={
        readingDirection !== ReadingDirection.WEBTOON ? height : undefined
      }
    >
      <GestureDetector gesture={gestures}>
        <PageRenderer />
      </GestureDetector>
    </Box>
  );
};

export default connector(React.memo(ChapterPage));
