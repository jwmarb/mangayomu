import React from 'react';
import Box from '@components/Box';
import { GestureDetector } from 'react-native-gesture-handler';
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
import { ChapterPageProps } from '@screens/Reader/components/ChapterPage';
import useAppSelector from '@hooks/useAppSelector';
import useBoolean from '@hooks/useBoolean';

const ChapterPage: React.FC<ChapterPageProps> = (props) => {
  const { readingDirection } = useChapterPageContext();
  const { width, height } = useScreenDimensions();
  const {
    page: { page: pageKey, chapter, pageNumber },
    extendedPageState,
  } = props;
  const backgroundColor = useAppSelector((state) =>
    state.settings.reader.backgroundColor.toLowerCase(),
  );
  const { stylizedHeight } = usePageScale(props);

  const pageZooming = usePageZooming(props, stylizedHeight);
  const { pinchScale, translateX, translateY, enablePan, togglePan } =
    pageZooming;

  const gestures = usePageGestures(
    pageZooming,
    props,
    stylizedHeight,
    enablePan,
    togglePan,
  );

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

export default ChapterPage;
