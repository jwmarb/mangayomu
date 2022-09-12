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

const WebtoonPage: React.FC<ConnectedPageProps> = (props) => {
  const {
    uri,
    manga,
    chapter,
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

  const maxScaleInitializer = () => {
    return _width / imageWidth;
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
  React.useEffect(() => {
    const listener = ExpoOrientation.addOrientationChangeListener((orientation) => {
      const { width: _width, height: _height } = Dimensions.get('window');
      setMaxScale(() => {
        return _width / imageWidth;
      });
      setImageHeightToWindowHeightRatio(() => {
        return _height / imageHeight;
      });
    });
    return () => {
      listener.remove();
    };
  }, []);

  const translateXInitializer = () => {
    return 0;
  };

  const scale = useSharedValue(maxScale);
  const translateX = useSharedValue(translateXInitializer());
  const translateY = useSharedValue(0);

  const [enabled, setEnabled] = React.useState<boolean>(() => {
    return false;
  });

  function handleOnScale(scale: number) {
    setEnabled(scale !== maxScale);
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
    runOnJS(openReaderModal)({ chapter, manga, uri });
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
            console.log(maxScale, event.velocity + context.startScale + event.scale - context.scale);
            scale.value = Math.min(
              Math.max(maxScale, event.velocity + context.startScale + event.scale - context.scale),
              maxScale * 4
            );
          })
        ),
    [maxScale]
  );

  const panGesture = React.useMemo(
    () =>
      Gesture.Pan()
        .enabled(enabled)
        .onStart(
          panHandler((event, context) => {
            console.log('start pan');
            context.translateX = translateX.value;
            context.translateY = translateY.value;
          })
        )
        .onUpdate(
          panHandler((event, context) => {
            context.calculatedHeight = imageHeight * scale.value;
            context.calculatedWidth = imageWidth * scale.value;
            context.shouldStopY = (context.calculatedHeight - imageHeight * maxScale) / 2;
            context.shouldStopX = (context.calculatedWidth - _width) / 2;

            translateY.value = Math.min(
              Math.max(event.translationY + context.translateY, -context.shouldStopY),
              context.shouldStopY
            );
            translateX.value = Math.min(
              Math.max(event.translationX + context.translateX, -context.shouldStopX),
              context.shouldStopX
            );
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
            if (scale.value >= imageHeightToWindowHeightRatio) {
              translateX.value = withDecay({
                velocity: e.velocityX,
                deceleration: 0.99,
                clamp: [-context.shouldStopX, context.shouldStopX],
              });
              translateY.value = withDecay(
                {
                  velocity: e.velocityY,
                  deceleration: 0.99,
                  clamp: [-context.shouldStopY, context.shouldStopY],
                },
                (finished?: boolean) => {
                  if (finished) {
                    if (translateY.value === context.shouldStopY && e.velocityY >= 1000 && isOfFirstChapter == null)
                      runOnJS(setEnabled)(false);
                    if (translateY.value === -context.shouldStopY && e.velocityY <= -1000) runOnJS(setEnabled)(false);
                  }
                }
              );
            } else if (context.calculatedWidth > _width) {
              translateX.value = withDecay({
                velocity: e.velocityX,
                deceleration: 0.99,
                clamp: [-context.shouldStopX, context.shouldStopX],
              });
            }
          })
        ),
    [deviceOrientation, imageHeightToWindowHeightRatio, imageHeight, imageWidth, _height, _width, enabled]
  );

  useMountedEffect(() => {
    if (scale.value !== maxScale && !enabled) {
      const timeout = setTimeout(() => setEnabled(true), 500);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [enabled]);

  useMountedEffect(() => {
    scale.value = maxScale;
    translateX.value = translateXInitializer();
    translateY.value = 0;
  }, [maxScale, imageHeightToWindowHeightRatio]);

  const tapGestures = Gesture.Race(
    Gesture.Exclusive(doubleTapGesture, singleTapGesture),
    longPressGesture,
    Gesture.Simultaneous(pinchGesture, panGesture)
  );

  return (
    <GestureDetector gesture={tapGestures}>
      <PageContainer imageHeight={imageHeight * maxScale} width={_width} height={_height}>
        <Animated.Image progressiveRenderingEnabled resizeMethod='resize' source={{ uri }} style={imageStyles} />
      </PageContainer>
    </GestureDetector>
  );
};

export default React.memo(WebtoonPage);
