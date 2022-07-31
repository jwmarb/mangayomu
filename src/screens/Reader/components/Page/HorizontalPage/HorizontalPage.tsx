import { Typography } from '@components/core';
import React from 'react';
import { Dimensions, Image, PanResponder, useWindowDimensions, View } from 'react-native';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import { PagePanGestureContext, PagePinchGestureContext, PageProps, PanResponderContext } from '../Page.interfaces';
import * as Clipboard from 'expo-clipboard';
import { convertToURI } from '@screens/MangaViewer/components/MangaCover/MangaCover.helpers';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import displayMessage from '@utils/displayMessage';
import connector, { ConnectedPageProps } from '@screens/Reader/components/Page/Page.redux';
import { Manga } from '@services/scraper/scraper.interfaces';
import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { Orientation, SizeClassIOS } from 'expo-screen-orientation';
import * as ExpoOrientation from 'expo-screen-orientation';
import { PageContainer } from '@screens/Reader/components/Page/Page.base';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  runOnUI,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import {
  GestureEvent,
  TapGestureHandler,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
  TouchableWithoutFeedback,
  NativeViewGestureHandler,
  PanGestureHandlerEventPayload,
  GestureUpdateEvent,
  GestureEventPayload,
  HandlerStateChangeEventPayload,
  GestureHandlerRootView,
  TapGestureHandlerEventPayload,
  LongPressGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { withAnchorPoint } from 'react-native-anchor-point';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { createPanResponderHandler, createEventHandler } from '../Page.helpers';
import useMountedEffect from '@hooks/useMountedEffect';
import {
  ImageScaling,
  ZoomStartPosition,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';

const HorizontalPage: React.FC<ConnectedPageProps> = (props) => {
  const {
    uri,
    manga,
    readerDirection,
    width: imageWidth,
    height: imageHeight,
    deviceOrientation,
    setShouldActivateOnStart: _setShouldActivateOnStart,
    isOfFirstChapter,
    toggleOverlay,
    openReaderModal,
    imageScaling,
    zoomStartPosition,
  } = props;

  const { height: _height, width: _width } = useWindowDimensions();
  // const [shouldReEnable, setShouldReEnable] = React.useState<boolean>(false);
  const shouldReEnable = React.useRef<boolean>(false);
  function isPortrait() {
    return deviceOrientation === Orientation.PORTRAIT_UP || deviceOrientation === Orientation.PORTRAIT_DOWN;
  }

  function isLandscape() {
    return deviceOrientation === Orientation.LANDSCAPE_LEFT || deviceOrientation === Orientation.LANDSCAPE_RIGHT;
  }
  function shouldEnablePan() {
    return maxScale >= 1 && imageScaling === ImageScaling.SMART_FIT;
  }
  function canSmartFit() {
    return imageWidth / imageHeight >= 1;
  }
  const maxScaleInitializer = () => {
    switch (imageScaling) {
      case ImageScaling.FIT_WIDTH:
        return _width / imageWidth;
      case ImageScaling.FIT_HEIGHT:
        return _height / imageHeight;
      case ImageScaling.FIT_SCREEN:
        if (isLandscape()) return _height / imageHeight;
        return _width / imageWidth;
      case ImageScaling.SMART_FIT:
        if (canSmartFit()) return _height / imageHeight;
        // console.log(`${uri}: ${imageWidth / imageHeight} | ${_width / _height}`);
        return _width / imageWidth;
      default:
        return _width / imageWidth;
    }
  };

  const enableInitializer = () => {
    switch (imageScaling) {
      case ImageScaling.FIT_HEIGHT:
        return isPortrait();
      case ImageScaling.FIT_WIDTH:
        return false;
      case ImageScaling.FIT_SCREEN:
        return false;
      case ImageScaling.SMART_FIT:
        if ((canSmartFit() && isPortrait()) || (isLandscape() && !canSmartFit())) return true;
        return false;
      default:
        return false;
    }
  };
  const [maxScale, setMaxScale] = React.useState(maxScaleInitializer);
  const imageHeightToWindowHeightRatioInitializer = () => {
    return _height / imageHeight;
  };
  const [imageHeightToWindowHeightRatio, setImageHeightToWindowHeightRatio] = React.useState(
    imageHeightToWindowHeightRatioInitializer
  );

  useMountedEffect(() => {
    setImageHeightToWindowHeightRatio(imageHeightToWindowHeightRatioInitializer);
  }, [_height, imageHeight, readerDirection]);

  useMountedEffect(() => {
    setMaxScale(maxScaleInitializer);
  }, [deviceOrientation, _width, imageWidth, readerDirection, imageScaling]);

  useMountedEffect(() => {
    shouldReEnable.current = false;
    setEnabled(enableInitializer);
  }, [readerDirection, imageScaling, deviceOrientation]);

  React.useEffect(() => {
    const listener = ExpoOrientation.addOrientationChangeListener((orientation) => {
      const { width: _width, height: _height } = Dimensions.get('window');
      function isLandscape() {
        return (
          orientation.orientationInfo.orientation === Orientation.LANDSCAPE_LEFT ||
          orientation.orientationInfo.orientation === Orientation.LANDSCAPE_RIGHT
        );
      }
      function isPortrait() {
        return (
          orientation.orientationInfo.orientation === Orientation.PORTRAIT_UP ||
          orientation.orientationInfo.orientation === Orientation.PORTRAIT_DOWN
        );
      }
      setEnabled(enableInitializer);
      setMaxScale(() => {
        switch (imageScaling) {
          case ImageScaling.FIT_WIDTH:
            return _width / imageWidth;
          case ImageScaling.FIT_HEIGHT:
            return _height / imageHeight;
          case ImageScaling.FIT_SCREEN:
            if (isLandscape()) return _height / imageHeight;
            return _width / imageWidth;
          case ImageScaling.SMART_FIT:
            if (canSmartFit()) return _height / imageHeight;
            // console.log(`${uri}: ${imageWidth / imageHeight} | ${_width / _height}`);
            return _width / imageWidth;
          default:
            return _width / imageWidth;
        }
      });
      setImageHeightToWindowHeightRatio(() => {
        return _height / imageHeight;
      });
    });
    return () => {
      listener.remove();
    };
  }, []);

  const translateYInitializer = (): number => {
    switch (imageScaling) {
      case ImageScaling.SMART_FIT:
      case ImageScaling.FIT_HEIGHT:
        if (isLandscape()) return (imageHeight * maxScale - _height) / 2;
      default:
        return 0;
    }
  };

  const translateXInitializer = (): number => {
    switch (imageScaling) {
      case ImageScaling.FIT_HEIGHT:
        if (isPortrait())
          switch (zoomStartPosition) {
            case ZoomStartPosition.AUTO: {
              switch (readerDirection) {
                case ReaderDirection.RIGHT_TO_LEFT:
                  return -(imageWidth * maxScale - _width) / 2;
                case ReaderDirection.LEFT_TO_RIGHT:
                  return (imageWidth * maxScale - _width) / 2;
                default:
                  return 0;
              }
            }
            case ZoomStartPosition.CENTER:
              return 0;
            case ZoomStartPosition.LEFT:
              return (imageWidth * maxScale - _width) / 2;
            case ZoomStartPosition.RIGHT:
              return -(imageWidth * maxScale - _width) / 2;
          }
        return 0;
      case ImageScaling.SMART_FIT:
        if (canSmartFit())
          switch (zoomStartPosition) {
            case ZoomStartPosition.AUTO: {
              if (isPortrait())
                switch (readerDirection) {
                  case ReaderDirection.RIGHT_TO_LEFT:
                    return -(imageWidth * maxScale - _width) / 2;
                  case ReaderDirection.LEFT_TO_RIGHT:
                    return (imageWidth * maxScale - _width) / 2;
                  default:
                    return 0;
                }
              return 0;
            }
            case ZoomStartPosition.CENTER:
              return 0;
            case ZoomStartPosition.LEFT:
              return (imageWidth * maxScale - _width) / 2;
            case ZoomStartPosition.RIGHT:
              return -(imageWidth * maxScale - _width) / 2;
          }
        return 0;
      default:
        return 0;
    }
  };

  const scale = useSharedValue(maxScale);
  const translateX = useSharedValue(translateXInitializer());
  const translateY = useSharedValue(translateYInitializer());

  const [enabled, setEnabled] = React.useState<boolean>(enableInitializer);

  function handleOnScale(scale: number) {
    switch (imageScaling) {
      case ImageScaling.FIT_HEIGHT:
      case ImageScaling.SMART_FIT:
        setEnabled(scale !== maxScale || enableInitializer());
        break;
      default:
        setEnabled(scale !== maxScale);
        break;
    }
  }

  const isMounted = React.useRef<boolean>(false);

  useDerivedValue(() => {
    if (isMounted.current) runOnJS(handleOnScale)(scale.value);
    else isMounted.current = true;
  }, [scale]);

  const handleOnDoubleTap = React.useCallback(() => {
    translateX.value = withTiming(0, { duration: 100, easing: Easing.ease });
    translateY.value = withTiming(0, { duration: 100, easing: Easing.ease });
    scale.value = withTiming(maxScale, { duration: 100, easing: Easing.ease });
    setEnabled(enableInitializer);
  }, [maxScale]);

  React.useLayoutEffect(() => {
    scale.value = maxScale;
  }, [deviceOrientation]);
  React.useEffect(() => {
    return () => {
      cancelAnimation(scale);
      cancelAnimation(translateX);
      cancelAnimation(translateY);
    };
  }, []);

  // styles handled by PinchGestureHandler
  const imageStyles = useAnimatedStyle(() => ({
    width: imageWidth,
    height: imageHeight,
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { scale: scale.value }],
  }));

  const panHandler = createEventHandler<PagePanGestureContext>();
  const pinchHandler = createEventHandler<PagePinchGestureContext>();

  const handleOnSingleTap = (event: HandlerStateChangeEventPayload & TapGestureHandlerEventPayload) => {
    if (event.numberOfPointers === 1) runOnJS(toggleOverlay)();
  };

  const handleOnLongPress = () => {
    runOnJS(openReaderModal)(uri);
  };

  const doubleTapGesture = React.useMemo(
    () => Gesture.Tap().numberOfTaps(2).onEnd(runOnUI(handleOnDoubleTap)),
    [handleOnDoubleTap]
  );
  const singleTapGesture = React.useMemo(() => Gesture.Tap().onEnd(runOnUI(handleOnSingleTap)), []);
  const longPressGesture = React.useMemo(() => Gesture.LongPress().onStart(runOnUI(handleOnLongPress)), []);

  const pinchGesture = React.useMemo(
    () =>
      Gesture.Pinch() // use PanResponder instead

        .onStart(
          pinchHandler((event, context) => {
            console.log('start pinch');
            context.scale = event.scale;
            context.startScale = scale.value;
          })
        )

        .onUpdate(
          pinchHandler((event, context) => {
            scale.value = Math.min(
              Math.max(maxScale, event.velocity + context.startScale + event.scale - context.scale),
              2
            );
          })
        ),
    [maxScale]
  );

  function panHandlerSmartFit(
    event: GestureEventPayload & PanGestureHandlerEventPayload,
    context: PagePanGestureContext
  ) {
    context.calculatedHeight = imageHeight * scale.value;
    context.calculatedWidth = imageWidth * scale.value;
    context.shouldStopY = (context.calculatedHeight - _height) / 2;
    context.shouldStopX = (context.calculatedWidth - _width) / 2;

    if (canSmartFit())
      switch (deviceOrientation) {
        case Orientation.LANDSCAPE_LEFT:
        case Orientation.LANDSCAPE_RIGHT:
          if (scale.value >= _width / imageWidth) {
            translateY.value = Math.min(
              Math.max(event.translationY + context.translateY, -context.shouldStopY),
              context.shouldStopY
            );
            translateX.value = Math.min(
              Math.max(event.translationX + context.translateX, -context.shouldStopX),
              context.shouldStopX
            );
          } else if (context.calculatedHeight > _height) {
            translateY.value = Math.min(
              Math.max(event.translationY + context.translateY, -context.shouldStopY),
              context.shouldStopY
            );
            translateX.value = withTiming(0, { duration: 100, easing: Easing.ease });
          } else {
            translateX.value = withTiming(0, { duration: 100, easing: Easing.ease });
            translateY.value = withTiming(0, { duration: 100, easing: Easing.ease });
          }
          break;
        default:
          if (scale.value >= imageHeightToWindowHeightRatio) {
            translateY.value = Math.min(
              Math.max(event.translationY + context.translateY, -context.shouldStopY),
              context.shouldStopY
            );
            translateX.value = Math.min(
              Math.max(event.translationX + context.translateX, -context.shouldStopX),
              context.shouldStopX
            );
          } else if (context.calculatedWidth > _width) {
            translateX.value = Math.min(
              Math.max(event.translationX + context.translateX, -context.shouldStopX),
              context.shouldStopX
            );
            translateY.value = withTiming(0, { duration: 100, easing: Easing.ease });
          } else {
            translateX.value = withTiming(0, { duration: 100, easing: Easing.ease });
            translateY.value = withTiming(0, { duration: 100, easing: Easing.ease });
          }
          break;
      }
    else
      switch (deviceOrientation) {
        case Orientation.LANDSCAPE_LEFT:
        case Orientation.LANDSCAPE_RIGHT:
          if (scale.value >= imageHeightToWindowHeightRatio) {
            translateY.value = Math.min(
              Math.max(event.translationY + context.translateY, -context.shouldStopY),
              context.shouldStopY
            );
            translateX.value = Math.min(
              Math.max(event.translationX + context.translateX, -context.shouldStopX),
              context.shouldStopX
            );
          } else if (context.calculatedHeight > _height) {
            translateY.value = Math.min(
              Math.max(event.translationY + context.translateY, -context.shouldStopY),
              context.shouldStopY
            );
            translateX.value = withTiming(0, { duration: 100, easing: Easing.ease });
          } else {
            translateX.value = withTiming(0, { duration: 100, easing: Easing.ease });
            translateY.value = withTiming(0, { duration: 100, easing: Easing.ease });
          }
          break;
        default:
          if (scale.value >= imageHeightToWindowHeightRatio) {
            translateY.value = Math.min(
              Math.max(event.translationY + context.translateY, -context.shouldStopY),
              context.shouldStopY
            );
            translateX.value = Math.min(
              Math.max(event.translationX + context.translateX, -context.shouldStopX),
              context.shouldStopX
            );
          } else if (context.calculatedWidth > _width) {
            translateX.value = Math.min(
              Math.max(event.translationX + context.translateX, -context.shouldStopX),
              context.shouldStopX
            );
            translateY.value = withTiming(0, { duration: 100, easing: Easing.ease });
          } else {
            translateX.value = withTiming(0, { duration: 100, easing: Easing.ease });
            translateY.value = withTiming(0, { duration: 100, easing: Easing.ease });
          }
          break;
      }
  }

  function panHandlerFitHeight(
    event: GestureEventPayload & PanGestureHandlerEventPayload,
    context: PagePanGestureContext
  ) {
    context.calculatedHeight = imageHeight * scale.value;
    context.calculatedWidth = imageWidth * scale.value;
    context.shouldStopY = (context.calculatedHeight - _height) / 2;
    context.shouldStopX = (context.calculatedWidth - _width) / 2;

    switch (deviceOrientation) {
      case Orientation.LANDSCAPE_LEFT:
      case Orientation.LANDSCAPE_RIGHT:
        if (1 <= context.calculatedWidth / _width) {
          translateY.value = Math.min(
            Math.max(event.translationY + context.translateY, -context.shouldStopY),
            context.shouldStopY
          );
          translateX.value = Math.min(
            Math.max(event.translationX + context.translateX, -context.shouldStopX),
            context.shouldStopX
          );
        } else if (context.calculatedHeight > _height) {
          translateY.value = Math.min(
            Math.max(event.translationY + context.translateY, -context.shouldStopY),
            context.shouldStopY
          );
          translateX.value = withTiming(0, { duration: 100, easing: Easing.ease });
        } else {
          translateX.value = withTiming(0, { duration: 100, easing: Easing.ease });
          translateY.value = withTiming(0, { duration: 100, easing: Easing.ease });
        }
        break;
      default:
        if (scale.value >= imageHeightToWindowHeightRatio) {
          translateY.value = Math.min(
            Math.max(event.translationY + context.translateY, -context.shouldStopY),
            context.shouldStopY
          );
          translateX.value = Math.min(
            Math.max(event.translationX + context.translateX, -context.shouldStopX),
            context.shouldStopX
          );
        } else if (context.calculatedWidth > _width) {
          translateX.value = Math.min(
            Math.max(event.translationX + context.translateX, -context.shouldStopX),
            context.shouldStopX
          );
          translateY.value = withTiming(0, { duration: 100, easing: Easing.ease });
        } else {
          translateX.value = withTiming(0, { duration: 100, easing: Easing.ease });
          translateY.value = withTiming(0, { duration: 100, easing: Easing.ease });
        }
        break;
    }
  }

  function panHandlerNormal(
    event: GestureEventPayload & PanGestureHandlerEventPayload,
    context: PagePanGestureContext
  ) {
    context.calculatedHeight = imageHeight * scale.value;
    context.calculatedWidth = imageWidth * scale.value;
    context.shouldStopY = (context.calculatedHeight - _height) / 2;
    context.shouldStopX = (context.calculatedWidth - _width) / 2;

    switch (deviceOrientation) {
      case Orientation.LANDSCAPE_LEFT:
      case Orientation.LANDSCAPE_RIGHT:
        if (scale.value >= imageHeightToWindowHeightRatio) {
          translateY.value = Math.min(
            Math.max(event.translationY + context.translateY, -context.shouldStopY),
            context.shouldStopY
          );
          translateX.value = Math.min(
            Math.max(event.translationX + context.translateX, -context.shouldStopX),
            context.shouldStopX
          );
        } else if (context.calculatedHeight > _height) {
          translateY.value = Math.min(
            Math.max(event.translationY + context.translateY, -context.shouldStopY),
            context.shouldStopY
          );
          translateX.value = withTiming(0, { duration: 100, easing: Easing.ease });
        } else {
          translateX.value = withTiming(0, { duration: 100, easing: Easing.ease });
          translateY.value = withTiming(0, { duration: 100, easing: Easing.ease });
        }
        break;
      default:
        if (scale.value >= imageHeightToWindowHeightRatio) {
          translateY.value = Math.min(
            Math.max(event.translationY + context.translateY, -context.shouldStopY),
            context.shouldStopY
          );
          translateX.value = Math.min(
            Math.max(event.translationX + context.translateX, -context.shouldStopX),
            context.shouldStopX
          );
        } else if (context.calculatedWidth > _width) {
          translateX.value = Math.min(
            Math.max(event.translationX + context.translateX, -context.shouldStopX),
            context.shouldStopX
          );
          translateY.value = withTiming(0, { duration: 100, easing: Easing.ease });
        } else {
          translateX.value = withTiming(0, { duration: 100, easing: Easing.ease });
          translateY.value = withTiming(0, { duration: 100, easing: Easing.ease });
        }
        break;
    }
  }

  function panHandlerEndNormal(e: GestureEventPayload & PanGestureHandlerEventPayload, context: PagePanGestureContext) {
    if (scale.value >= imageHeightToWindowHeightRatio) {
      translateX.value = withDecay(
        {
          velocity: e.velocityX,
          deceleration: 0.99,
          clamp: [-context.shouldStopX, context.shouldStopX],
        },
        (finished?: boolean) => {
          if (finished) {
            switch (readerDirection) {
              case ReaderDirection.RIGHT_TO_LEFT:
                if (translateX.value === context.shouldStopX && e.velocityX >= 1000) runOnJS(setEnabled)(false);
                if (translateX.value === -context.shouldStopX && isOfFirstChapter == null && e.velocityX <= -1000)
                  runOnJS(setEnabled)(false);
                break;
              case ReaderDirection.LEFT_TO_RIGHT:
                if (translateX.value === context.shouldStopX && isOfFirstChapter == null && e.velocityX >= -1000)
                  runOnJS(setEnabled)(false);
                if (translateX.value === -context.shouldStopX && e.velocityX <= -1000) runOnJS(setEnabled)(false);
            }
          }
        }
      );
      translateY.value = withDecay({
        velocity: e.velocityY,
        deceleration: 0.99,
        clamp: [-context.shouldStopY, context.shouldStopY],
      });
    } else if (context.calculatedWidth > _width) {
      translateX.value = withDecay(
        {
          velocity: e.velocityX,
          deceleration: 0.99,
          clamp: [-context.shouldStopX, context.shouldStopX],
        },
        (finished?: boolean) => {
          if (finished) {
            switch (readerDirection) {
              case ReaderDirection.RIGHT_TO_LEFT:
                if (translateX.value === context.shouldStopX && e.velocityX >= 1000) runOnJS(setEnabled)(false);
                if (translateX.value === -context.shouldStopX && isOfFirstChapter == null && e.velocityX <= -1000)
                  runOnJS(setEnabled)(false);
                break;
              case ReaderDirection.LEFT_TO_RIGHT:
                if (translateX.value === context.shouldStopX && isOfFirstChapter == null && e.velocityX >= -1000)
                  runOnJS(setEnabled)(false);
                if (translateX.value === -context.shouldStopX && e.velocityX <= -1000) runOnJS(setEnabled)(false);
            }
          }
        }
      );
    }
  }

  function panHandlerEndSmartFit(
    e: GestureEventPayload & PanGestureHandlerEventPayload,
    context: PagePanGestureContext
  ) {
    if (canSmartFit() && isLandscape()) {
      if (scale.value >= _width / imageWidth) {
        console.log('end here');
        translateX.value = withDecay(
          {
            velocity: e.velocityX,
            deceleration: 0.99,
            clamp: [-context.shouldStopX, context.shouldStopX],
          },
          (finished?: boolean) => {
            if (finished) {
              switch (readerDirection) {
                case ReaderDirection.RIGHT_TO_LEFT:
                  if (translateX.value === context.shouldStopX && e.velocityX >= 1000) runOnJS(setEnabled)(false);
                  if (translateX.value === -context.shouldStopX && isOfFirstChapter == null && e.velocityX <= -1000)
                    runOnJS(setEnabled)(false);
                  break;
                case ReaderDirection.LEFT_TO_RIGHT:
                  if (translateX.value === context.shouldStopX && isOfFirstChapter == null && e.velocityX >= -1000)
                    runOnJS(setEnabled)(false);
                  if (translateX.value === -context.shouldStopX && e.velocityX <= -1000) runOnJS(setEnabled)(false);
              }
            }
          }
        );
        translateY.value = withDecay({
          velocity: e.velocityY,
          deceleration: 0.99,
          clamp: [-context.shouldStopY, context.shouldStopY],
        });
      } else if (context.calculatedWidth < _width) {
        translateX.value = withDecay(
          {
            velocity: e.velocityX,
            deceleration: 0.99,
            clamp: [-context.shouldStopX, context.shouldStopX],
          },
          (finished?: boolean) => {
            if (finished) {
              switch (readerDirection) {
                case ReaderDirection.RIGHT_TO_LEFT:
                  if (e.velocityX >= 1000) runOnJS(setEnabled)(false);
                  if (isOfFirstChapter == null && e.velocityX <= -1000) runOnJS(setEnabled)(false);
                  break;
                case ReaderDirection.LEFT_TO_RIGHT:
                  if (isOfFirstChapter == null && e.velocityX >= -1000) runOnJS(setEnabled)(false);
                  if (e.velocityX <= -1000) runOnJS(setEnabled)(false);
                  break;
              }
            }
          }
        );
      }
    } else if (scale.value >= imageHeightToWindowHeightRatio) {
      translateX.value = withDecay(
        {
          velocity: e.velocityX,
          deceleration: 0.99,
          clamp: [-context.shouldStopX, context.shouldStopX],
        },
        (finished?: boolean) => {
          if (finished) {
            switch (readerDirection) {
              case ReaderDirection.RIGHT_TO_LEFT:
                if (translateX.value === context.shouldStopX && e.velocityX >= 1000) runOnJS(setEnabled)(false);
                if (translateX.value === -context.shouldStopX && isOfFirstChapter == null && e.velocityX <= -1000)
                  runOnJS(setEnabled)(false);
                break;
              case ReaderDirection.LEFT_TO_RIGHT:
                if (translateX.value === context.shouldStopX && isOfFirstChapter == null && e.velocityX >= -1000)
                  runOnJS(setEnabled)(false);
                if (translateX.value === -context.shouldStopX && e.velocityX <= -1000) runOnJS(setEnabled)(false);
            }
          }
        }
      );
      translateY.value = withDecay({
        velocity: e.velocityY,
        deceleration: 0.99,
        clamp: [-context.shouldStopY, context.shouldStopY],
      });
    } else if (context.calculatedWidth > _width) {
      translateX.value = withDecay(
        {
          velocity: e.velocityX,
          deceleration: 0.99,
          clamp: [-context.shouldStopX, context.shouldStopX],
        },
        (finished?: boolean) => {
          if (finished) {
            switch (readerDirection) {
              case ReaderDirection.RIGHT_TO_LEFT:
                if (translateX.value === context.shouldStopX && e.velocityX >= 1000) runOnJS(setEnabled)(false);
                if (translateX.value === -context.shouldStopX && isOfFirstChapter == null && e.velocityX <= -1000)
                  runOnJS(setEnabled)(false);
                break;
              case ReaderDirection.LEFT_TO_RIGHT:
                if (translateX.value === context.shouldStopX && isOfFirstChapter == null && e.velocityX >= -1000)
                  runOnJS(setEnabled)(false);
                if (translateX.value === -context.shouldStopX && e.velocityX <= -1000) runOnJS(setEnabled)(false);
            }
          }
        }
      );
    }
  }

  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .enabled(enabled)
        .onStart(
          panHandler((event, context) => {
            // console.log('start pan');
            context.translateX = translateX.value;
            context.translateY = translateY.value;
          })
        )
        .onUpdate(
          panHandler((event, context) => {
            switch (imageScaling) {
              case ImageScaling.SMART_FIT:
                panHandlerSmartFit(event, context);
                break;
              case ImageScaling.FIT_HEIGHT:
                panHandlerFitHeight(event, context);
                break;
              default:
                panHandlerNormal(event, context);
                break;
            }
          })
        )
        // .onTouchesCancelled(
        //   panHandler(() => {
        //     console.log('touches have been cancelled');
        //     setTimeout(() => setEnabled(true), 1000);
        //   })
        // )
        .onEnd(
          panHandler((e, context) => {
            switch (imageScaling) {
              case ImageScaling.SMART_FIT:
                panHandlerEndSmartFit(e, context);
                break;
              default:
                panHandlerEndNormal(e, context);
                break;
            }
          })
        ),
    [deviceOrientation, imageHeightToWindowHeightRatio, imageHeight, imageWidth, _height, _width, enabled, imageScaling]
  );

  React.useEffect(() => {
    if (shouldReEnable.current) {
      if (
        (scale.value !== maxScale ||
          shouldEnablePan() ||
          (isPortrait() && imageScaling === ImageScaling.FIT_HEIGHT) ||
          (isLandscape() && imageScaling === ImageScaling.SMART_FIT)) &&
        !enabled
      ) {
        const timeout = setTimeout(() => setEnabled(true), 500);
        return () => {
          clearTimeout(timeout);
        };
      }
    } else shouldReEnable.current = true;
  }, [enabled]);

  useMountedEffect(() => {
    scale.value = maxScale;
    translateX.value = translateXInitializer();
    translateY.value = translateYInitializer();
  }, [maxScale, imageHeightToWindowHeightRatio]);

  const tapGestures = Gesture.Race(
    Gesture.Exclusive(doubleTapGesture, singleTapGesture),
    longPressGesture,
    Gesture.Simultaneous(pinchGesture, panGesture)
  );

  return (
    <GestureDetector gesture={tapGestures}>
      <PageContainer width={_width} height={_height}>
        <Animated.Image source={{ uri }} style={imageStyles} />
      </PageContainer>
    </GestureDetector>
  );
};

export default React.memo(HorizontalPage);
