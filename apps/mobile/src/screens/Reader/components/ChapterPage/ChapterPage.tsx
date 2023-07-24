import React from 'react';
import Box from '@components/Box';
import { GestureDetector } from 'react-native-gesture-handler';
import connector, { ConnectedChapterPageProps } from './ChapterPage.redux';
import {
  ImageScaling,
  ReadingDirection,
  ZoomStartPosition,
} from '@redux/slices/settings';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import usePageGestures from '@screens/Reader/components/ChapterPage/hooks/usePageGestures';
import usePageRenderer from '@screens/Reader/components/ChapterPage/hooks/usePageRenderer';
import usePageDownloader from '@screens/Reader/components/ChapterPage/hooks/usePageDownloader';
import { useAnimatedStyle } from 'react-native-reanimated';
import usePageZooming from '@screens/Reader/components/ChapterPage/hooks/usePageZooming';
import usePageScale from '@screens/Reader/components/ChapterPage/hooks/usePageScale';

const ChapterPage: React.FC<ConnectedChapterPageProps> = (props) => {
  const { readingDirection } = useChapterPageContext();
  const { width, height } = useScreenDimensions();
  const { page: pageKey, chapter, pageNumber } = props.page;
  const { extendedPageState, backgroundColor } = props;
  const { stylizedHeight } = usePageScale(props);

  const pageZooming = usePageZooming(props, stylizedHeight);
  const { pinchScale, translateX, translateY } = pageZooming;

  const gestures = usePageGestures(pageZooming, props, stylizedHeight);

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
  const PageRenderer = usePageRenderer(props, style, stylizedHeight);
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

export default connector(ChapterPage);
