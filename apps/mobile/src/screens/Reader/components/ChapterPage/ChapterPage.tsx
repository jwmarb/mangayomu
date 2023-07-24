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
import {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';

const ChapterPage: React.FC<ConnectedChapterPageProps> = (props) => {
  const {
    readingDirection,
    imageScaling,
    zoomStartPosition: enumZoomStartPosition,
  } = useChapterPageContext();
  const { width, height } = useScreenDimensions();
  const { page: pageKey, chapter, pageNumber } = props.page;
  const { extendedPageState, backgroundColor, pageAspectRatio } = props;
  const imageWidth = props.page.width;
  const imageHeight = props.page.height;
  const scale = width / imageWidth;
  const stylizedHeight = ReadingDirection.WEBTOON
    ? scale * imageHeight
    : height;

  const initializePinchScale = (
    width: number,
    height: number,
    readingDirection: ReadingDirection,
    imageScaling: ImageScaling,
  ): number => {
    const deviceAspectRatio = width / height;
    const isImageWide = imageWidth / imageHeight >= 1;

    function fitScaleToHeight() {
      return imageWidth / imageHeight / deviceAspectRatio;
    }
    function fitScaleToWidth() {
      return 1; // by default, all images are scaled to device width
    }
    function fitScaleToScreen() {
      if (isImageWide) return fitScaleToHeight();
      return fitScaleToWidth();
    }

    function fitScaleSmart() {
      if (isImageWide) return imageWidth / imageHeight / pageAspectRatio;
      return fitScaleToWidth();
    }

    if (readingDirection !== ReadingDirection.WEBTOON) {
      switch (imageScaling) {
        case ImageScaling.FIT_HEIGHT:
          return fitScaleToHeight();
        case ImageScaling.FIT_WIDTH:
          return fitScaleToWidth();
        case ImageScaling.FIT_SCREEN:
          return fitScaleToScreen();
        case ImageScaling.SMART_FIT:
          return fitScaleSmart();
      }
    }
    return 1;
  };
  const minScale = useSharedValue<number>(
    initializePinchScale(width, height, readingDirection, imageScaling),
  );
  const pinchScale = useSharedValue(minScale.value);

  const initializeZoomStartPositionX = (
    pinchScale: number,

    readingDirection: ReadingDirection,
    enumZoomStartPosition: ZoomStartPosition,
  ) => {
    if (readingDirection === ReadingDirection.WEBTOON) return 0;
    const { width } = Dimensions.get('screen');
    const startingX = pinchScale > 1 ? width / 2 - width / (pinchScale * 2) : 0;
    switch (enumZoomStartPosition) {
      case ZoomStartPosition.AUTOMATIC:
        switch (readingDirection) {
          case ReadingDirection.LEFT_TO_RIGHT:
            return startingX;
          case ReadingDirection.RIGHT_TO_LEFT:
            return -startingX;
          default:
            return 0;
        }
      case ZoomStartPosition.LEFT:
        return startingX;
      case ZoomStartPosition.RIGHT:
        return -startingX;
      default:
        return 0;
    }
  };
  const initializeZoomStartPositionY = (
    pinchScale: number,
    readingDirection: ReadingDirection,
    stylizedHeight: number,
    enumZoomStartPosition: ZoomStartPosition,
  ) => {
    if (readingDirection === ReadingDirection.WEBTOON) return 0;
    const { height } = Dimensions.get('screen');
    const startingY = Math.max(
      0,
      stylizedHeight / 2 - height / (pinchScale * 2),
    );
    switch (enumZoomStartPosition) {
      case ZoomStartPosition.AUTOMATIC:
        switch (readingDirection) {
          case ReadingDirection.VERTICAL:
            return startingY;
          default:
            return 0;
        }
      default:
        return 0;
    }
  };

  React.useEffect(() => {
    const val = initializePinchScale(
      width,
      height,
      readingDirection,
      imageScaling,
    );
    pinchScale.value = val;
    minScale.value = val;
    translateX.value =
      val > 1
        ? initializeZoomStartPositionX(
            val,
            readingDirection,
            enumZoomStartPosition,
          )
        : 0;
    translateY.value =
      val > 1
        ? initializeZoomStartPositionY(
            val,
            readingDirection,
            stylizedHeight,
            enumZoomStartPosition,
          )
        : 0;
  }, [imageScaling, enumZoomStartPosition]);

  React.useEffect(() => {
    const listener = Dimensions.addEventListener('change', ({ screen }) => {
      const val = initializePinchScale(
        screen.width,
        screen.height,
        readingDirection,
        imageScaling,
      );
      pinchScale.value = val;
      minScale.value = val;
    });
    return () => {
      listener.remove();
    };
  }, []);

  const translateX = useSharedValue(
    minScale.value > 1
      ? initializeZoomStartPositionX(
          pinchScale.value,
          readingDirection,
          enumZoomStartPosition,
        )
      : 0,
  );
  const translateY = useSharedValue(
    minScale.value > 1
      ? initializeZoomStartPositionY(
          pinchScale.value,
          readingDirection,
          stylizedHeight,
          enumZoomStartPosition,
        )
      : 0,
  );

  const gestures = usePageGestures({
    pageKey,
    pinchScale,
    translateX,
    translateY,
    stylizedHeight,
    readingDirection,
    minScale,
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
