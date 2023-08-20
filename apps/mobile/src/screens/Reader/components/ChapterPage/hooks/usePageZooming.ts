import useAppSelector from '@hooks/useAppSelector';
import useBoolean from '@hooks/useBoolean';
import useMutableObject from '@hooks/useMutableObject';
import useScreenDimensions from '@hooks/useScreenDimensions';
import {
  ImageScaling,
  ReadingDirection,
  ZoomStartPosition,
} from '@redux/slices/settings';
import { ChapterPageProps } from '@screens/Reader/components/ChapterPage';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import React from 'react';
import { Dimensions } from 'react-native';
import {
  runOnJS,
  runOnUI,
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
  props: ChapterPageProps,
  stylizedHeight: number,
) {
  const {
    page: { width: imageWidth, height: imageHeight, page },
  } = props;
  const pageAspectRatio = useAppSelector(
    (state) => state.reader.pageAspectRatio,
  );

  const {
    readingDirection: _readingDirection,
    imageScaling: _imageScaling,
    zoomStartPosition: _zoomStartPosition,
    animatedPreviousState,
  } = useChapterPageContext();
  const [enablePan, togglePan] = useBoolean();
  const readingDirection = useMutableObject(_readingDirection);
  const zoomStartPosition = useMutableObject(_zoomStartPosition);
  const imageScaling = useMutableObject(_imageScaling);
  const { width, height } = useScreenDimensions();
  const prevPage = React.useRef(page);
  const initialMinScale = React.useMemo(
    () =>
      initializePinchScale(
        width,
        height,
        readingDirection.current,
        imageScaling.current,
        imageWidth,
        imageHeight,
        pageAspectRatio,
      ),
    [],
  );
  const minScale = useSharedValue<number>(initialMinScale);
  const pinchScale = useSharedValue(initialMinScale);
  const initialTranslateX = React.useMemo(
    () =>
      minScale.value > 1
        ? initializeZoomStartPositionX(
            pinchScale.value,
            readingDirection.current,
            zoomStartPosition.current,
          )
        : 0,
    [],
  );
  const translateX = useSharedValue(initialTranslateX);
  const initialTranslateY = React.useMemo(
    () =>
      initializeZoomStartPositionY(
        pinchScale.value,
        readingDirection.current,
        stylizedHeight,
      ),
    [],
  );
  const translateY = useSharedValue(initialTranslateY);

  function setPinchScale(val: number) {
    'worklet';
    pinchScale.value = val;
  }

  function setMinScale(val: number) {
    'worklet';
    minScale.value = val;
  }

  function setScales(val: number) {
    'worklet';
    minScale.value = val;
    pinchScale.value = val;
  }
  function setTranslateX(val: number) {
    'worklet';
    translateX.value = val;
  }
  function setTranslateY(val: number) {
    'worklet';
    translateY.value = val;
  }

  if (prevPage.current !== page) {
    const prevPageCopy = prevPage.current;
    prevPage.current = page;
    const prevState = animatedPreviousState.current[page];
    const prevStateOfPrevPage = animatedPreviousState.current[prevPageCopy];

    if (prevState != null) {
      togglePan(
        (prevState.minScale > 1 && prevState.scale >= prevState.minScale) ||
          prevState.minScale < prevState.scale,
      );
      runOnUI(setMinScale)(prevState.minScale);
      runOnUI(setPinchScale)(prevState.scale);
      runOnUI(setTranslateX)(prevState.translateX);
      runOnUI(setTranslateY)(prevState.translateY);
    } else {
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
      togglePan(initializedMinScale > 1);

      animatedPreviousState.current[page] = {
        minScale: initializedMinScale,
        scale: initializedMinScale,
        translateX: initializedTranslateX,
        translateY: initializedTranslateY,
        initialTranslateX: initializedTranslateX,
        initialTranslateY: initializedTranslateY,
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
          const initialTranslateX =
            val > 1
              ? initializeZoomStartPositionX(
                  val,
                  readingDirection.current,
                  zoomStartPosition.current,
                )
              : 0;
          const initialTranslateY = initializeZoomStartPositionY(
            val,
            readingDirection.current,
            stylizedHeight,
          );
          return {
            minScale: val,
            scale: val,
            translateX: initialTranslateX,
            initialTranslateX,
            translateY: initialTranslateY,
            initialTranslateY,
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
          const initialTranslateX =
            val > 1
              ? initializeZoomStartPositionX(
                  val,
                  readingDirection.current,
                  zoomStartPosition.current,
                )
              : 0;
          const initialTranslateY = initializeZoomStartPositionY(
            val,
            readingDirection.current,
            stylizedHeight,
          );
          return {
            minScale: val,
            scale: val,
            translateX: initialTranslateX,
            initialTranslateX,
            translateY: initialTranslateY,
            initialTranslateY,
          };
        },
      };
      runOnUI(setScales)(initializedMinScale);
      runOnUI(setTranslateX)(initializedTranslateX);
      runOnUI(setTranslateY)(initializedTranslateY);
    }

    if (
      prevStateOfPrevPage?.scale === prevStateOfPrevPage?.minScale &&
      prevStateOfPrevPage?.translateX ===
        prevStateOfPrevPage?.initialTranslateX &&
      prevStateOfPrevPage?.translateY === prevStateOfPrevPage?.initialTranslateY
    ) {
      delete animatedPreviousState.current[prevPageCopy];
    }
  }

  function setAnimatedState(
    key: 'translateX' | 'translateY' | 'scale' | 'minScale',
    value: number,
  ) {
    if (prevPage.current in animatedPreviousState.current)
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      animatedPreviousState.current[prevPage.current]![key] = value;
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

  return { translateX, translateY, pinchScale, minScale, enablePan, togglePan };
}
