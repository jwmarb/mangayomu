import React from 'react';
import Box from '@components/Box';
import { GestureDetector } from 'react-native-gesture-handler';
import connector, { ConnectedChapterPageProps } from './ChapterPage.redux';
import { ReadingDirection } from '@redux/slices/settings';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import usePageGestures from '@screens/Reader/components/ChapterPage/hooks/usePageGestures';
import usePageRenderer from '@screens/Reader/components/ChapterPage/hooks/usePageRenderer';
import usePageDownloader from '@screens/Reader/components/ChapterPage/hooks/usePageDownloader';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

const ChapterPage: React.FC<ConnectedChapterPageProps> = (props) => {
  const { readingDirection } = useChapterPageContext();
  const { width, height } = useScreenDimensions();
  const { page: pageKey, chapter, pageNumber } = props.page;
  const { extendedPageState, backgroundColor } = props;
  const imageWidth = props.page.width;
  const imageHeight = props.page.height;
  const scale = width / imageWidth;
  const pinchScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const stylizedHeight = ReadingDirection.WEBTOON
    ? scale * imageHeight
    : height;
  const gestures = usePageGestures({
    pageKey,
    pinchScale,
    translateX,
    translateY,
    stylizedHeight,
  });

  const gestureStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: pinchScale.value,
      },
      {
        translateX: translateX.value,
      },
      {
        translateY: translateY.value,
      },
    ],
  }));
  const style = React.useMemo(
    () => [gestureStyle, { width, height: stylizedHeight }] as const,
    [width, stylizedHeight],
  );
  const PageRenderer = usePageRenderer({
    extendedPageState,
    pageKey,
    style,
    stylizedHeight,
    backgroundColor,
    readingDirection,
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
