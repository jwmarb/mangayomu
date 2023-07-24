import useScreenDimensions from '@hooks/useScreenDimensions';
import {
  ImageScaling,
  ReadingDirection,
  ZoomStartPosition,
} from '@redux/slices/settings';
import { ConnectedChapterPageProps } from '@screens/Reader/components/ChapterPage/ChapterPage.redux';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import React from 'react';
import { Dimensions } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';

export default function usePageZooming(
  props: ConnectedChapterPageProps,
  stylizedHeight: number,
) {
  const {
    page: { width: imageWidth, height: imageHeight },
    pageAspectRatio,
  } = props;
  const { readingDirection, imageScaling, zoomStartPosition } =
    useChapterPageContext();
  const { width, height } = useScreenDimensions();

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
    zoomStartPosition: ZoomStartPosition,
  ) => {
    if (readingDirection === ReadingDirection.WEBTOON) return 0;
    const { width } = Dimensions.get('screen');
    const startingX = pinchScale > 1 ? width / 2 - width / (pinchScale * 2) : 0;
    switch (zoomStartPosition) {
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
    zoomStartPosition: ZoomStartPosition,
  ) => {
    if (readingDirection === ReadingDirection.WEBTOON) return 0;
    const { height } = Dimensions.get('screen');
    const startingY = Math.max(
      0,
      stylizedHeight / 2 - height / (pinchScale * 2),
    );
    switch (zoomStartPosition) {
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
        ? initializeZoomStartPositionX(val, readingDirection, zoomStartPosition)
        : 0;
    translateY.value =
      val > 1
        ? initializeZoomStartPositionY(
            val,
            readingDirection,
            stylizedHeight,
            zoomStartPosition,
          )
        : 0;
  }, [imageScaling, zoomStartPosition]);

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
          zoomStartPosition,
        )
      : 0,
  );
  const translateY = useSharedValue(
    minScale.value > 1
      ? initializeZoomStartPositionY(
          pinchScale.value,
          readingDirection,
          stylizedHeight,
          zoomStartPosition,
        )
      : 0,
  );

  return { translateX, translateY, pinchScale, minScale };
}
