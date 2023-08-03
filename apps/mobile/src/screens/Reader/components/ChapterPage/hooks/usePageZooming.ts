import useMutableObject from '@hooks/useMutableObject';
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
import {
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
} from 'react-native-reanimated';

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
) => {
  if (readingDirection === ReadingDirection.WEBTOON) return 0;
  const { height } = Dimensions.get('screen');
  const startingY = Math.max(0, stylizedHeight / 2 - height / (pinchScale * 2));
  return startingY;
};

const initializePinchScale = (
  width: number,
  height: number,
  readingDirection: ReadingDirection,
  imageScaling: ImageScaling,
  imageWidth: number,
  imageHeight: number,
  pageAspectRatio: number,
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

export default function usePageZooming(
  props: ConnectedChapterPageProps,
  stylizedHeight: number,
) {
  const {
    page: { width: imageWidth, height: imageHeight, page },
    pageAspectRatio,
  } = props;
  const {
    readingDirection: _readingDirection,
    imageScaling: _imageScaling,
    zoomStartPosition: _zoomStartPosition,
    animatedPreviousState,
  } = useChapterPageContext();
  const readingDirection = useMutableObject(_readingDirection);
  const zoomStartPosition = useMutableObject(_zoomStartPosition);
  const imageScaling = useMutableObject(_imageScaling);
  const { width, height } = useScreenDimensions();
  const initializingAnimationStates = React.useRef<boolean>(true);
  const minScale = useSharedValue<number>(
    initializePinchScale(
      width,
      height,
      readingDirection.current,
      imageScaling.current,
      imageWidth,
      imageHeight,
      pageAspectRatio,
    ),
  );
  const pinchScale = useSharedValue(minScale.value);
  const translateX = useSharedValue(
    minScale.value > 1
      ? initializeZoomStartPositionX(
          pinchScale.value,
          readingDirection.current,
          zoomStartPosition.current,
        )
      : 0,
  );
  const translateY = useSharedValue(
    initializeZoomStartPositionY(
      pinchScale.value,
      readingDirection.current,
      stylizedHeight,
    ),
  );

  React.useEffect(() => {
    const prevState = animatedPreviousState.current[page];
    const initializedMinScale = initializePinchScale(
      width,
      height,
      readingDirection.current,
      imageScaling.current,
      imageWidth,
      imageHeight,
      pageAspectRatio,
    );
    const initializedTranslateX =
      initializedMinScale > 1
        ? initializeZoomStartPositionX(
            initializedMinScale,
            readingDirection.current,
            zoomStartPosition.current,
          )
        : 0;
    const initializedTranslateY = initializeZoomStartPositionY(
      initializedMinScale,
      readingDirection.current,
      stylizedHeight,
    );
    if (prevState != null) {
      minScale.value = prevState.minScale;
      pinchScale.value = prevState.scale;
      translateX.value = prevState.translateX;
      translateY.value = prevState.translateY;
    } else {
      animatedPreviousState.current[page] = {
        minScale: initializedMinScale,
        scale: initializedMinScale,
        translateX: initializedTranslateX,
        translateY: initializedTranslateY,
        onImageTypeChange: () => {
          const val = initializePinchScale(
            width,
            height,
            readingDirection.current,
            imageScaling.current,
            imageWidth,
            imageHeight,
            pageAspectRatio,
          );
          return {
            minScale: val,
            scale: val,
            translateX:
              val > 1
                ? initializeZoomStartPositionX(
                    val,
                    readingDirection.current,
                    zoomStartPosition.current,
                  )
                : 0,
            translateY: initializeZoomStartPositionY(
              val,
              readingDirection.current,
              stylizedHeight,
            ),
          };
        },
        onDimensionsChange: (width, height) => {
          const val = initializePinchScale(
            width,
            height,
            readingDirection.current,
            imageScaling.current,
            imageWidth,
            imageHeight,
            pageAspectRatio,
          );
          return {
            minScale: val,
            scale: val,
            translateX:
              val > 1
                ? initializeZoomStartPositionX(
                    val,
                    readingDirection.current,
                    zoomStartPosition.current,
                  )
                : 0,
            translateY: initializeZoomStartPositionY(
              val,
              readingDirection.current,
              stylizedHeight,
            ),
          };
        },
      };
      minScale.value = initializedMinScale;
      pinchScale.value = initializedMinScale;
      translateX.value = initializedTranslateX;
      translateY.value = initializedTranslateY;
    }
    initializingAnimationStates.current = false;
    return () => {
      initializingAnimationStates.current = true;
      if (
        animatedPreviousState.current[page]?.scale === initializedMinScale &&
        animatedPreviousState.current[page]?.translateX ===
          initializedTranslateX &&
        animatedPreviousState.current[page]?.translateY ===
          initializedTranslateY
      )
        delete animatedPreviousState.current[page];
    };
  }, [page]);

  function setAnimatedState(
    key: 'translateX' | 'translateY' | 'scale' | 'minScale',
    value: number,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    // console.log(animatedPreviousState.current[currentPage.current]);
    if (
      !initializingAnimationStates.current &&
      page in animatedPreviousState.current
    )
      animatedPreviousState.current[page]![key] = value;
  }

  useAnimatedReaction(
    () => pinchScale.value,
    (result) => {
      runOnJS(setAnimatedState)('scale', result);
    },
  );

  useAnimatedReaction(
    () => minScale.value,
    (result) => {
      runOnJS(setAnimatedState)('minScale', result);
    },
  );

  useAnimatedReaction(
    () => translateX.value,
    (result) => {
      runOnJS(setAnimatedState)('translateX', result);
    },
  );

  useAnimatedReaction(
    () => translateY.value,
    (result) => {
      runOnJS(setAnimatedState)('translateY', result);
    },
  );

  React.useEffect(() => {
    const val = initializePinchScale(
      width,
      height,
      readingDirection.current,
      imageScaling.current,
      imageWidth,
      imageHeight,
      pageAspectRatio,
    );
    pinchScale.value = val;
    minScale.value = val;
    translateX.value =
      val > 1
        ? initializeZoomStartPositionX(
            val,
            readingDirection.current,
            zoomStartPosition.current,
          )
        : 0;
    translateY.value = initializeZoomStartPositionY(
      val,
      readingDirection.current,
      stylizedHeight,
    );
  }, [_imageScaling, _zoomStartPosition]);

  React.useEffect(() => {
    const listener = Dimensions.addEventListener('change', ({ screen }) => {
      const val = initializePinchScale(
        screen.width,
        screen.height,
        readingDirection.current,
        imageScaling.current,
        imageWidth,
        imageHeight,
        pageAspectRatio,
      );
      pinchScale.value = val;
      minScale.value = val;
      translateX.value =
        val > 1
          ? initializeZoomStartPositionX(
              val,
              readingDirection.current,
              zoomStartPosition.current,
            )
          : 0;
      translateY.value = initializeZoomStartPositionY(
        val,
        readingDirection.current,
        stylizedHeight,
      );
    });
    return () => {
      listener.remove();
    };
  }, []);

  return { translateX, translateY, pinchScale, minScale };
}
