import Button from '@components/Button';
import Flex from '@components/Flex';
import {
  BackdropContainer,
  BackdropPressable,
  ModalContainer,
  Panel,
  StatusBarFiller,
} from '@components/Modal/Modal.base';
import { GestureContext, ModalProps } from '@components/Modal/Modal.interfaces';
import { Typography } from '@components/Typography';
import { Portal } from '@gorhom/portal';
import { AppState } from '@redux/store';
import pixelToNumber from '@utils/pixelToNumber';
import { Orientation } from 'expo-screen-orientation';
import React from 'react';
import {
  BackHandler,
  Dimensions,
  GestureResponderEvent,
  LayoutChangeEvent,
  Modal as DefaultModal,
  NativeEventSubscription,
  NativeScrollEvent,
  NativeSyntheticEvent,
  PanResponderGestureState,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {
  GestureEvent,
  HandlerStateChangeEvent,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
  PanGestureHandlerGestureEvent,
  State,
  TouchableWithoutFeedback,
  ScrollView,
  NativeViewGestureHandler,
  NativeViewGestureHandlerPayload,
  FlatList,
} from 'react-native-gesture-handler';
import Animated, {
  call,
  cancelAnimation,
  Easing,
  runOnJS,
  runOnUI,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useCode,
  useDerivedValue,
  useSharedValue,
  Value,
  withDecay,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSelector } from 'react-redux';
import { RecyclerListView, RecyclerListViewProps } from 'recyclerlistview';
import { ScrollEvent } from 'recyclerlistview/dist/reactnative/core/scrollcomponent/BaseScrollView';
import { WindowCorrection } from 'recyclerlistview/dist/reactnative/core/ViewabilityTracker';
import { useTheme } from 'styled-components/native';

const Modal: React.FC<ModalProps> = (props) => {
  const {
    onClose,
    visible,
    children,
    minimumHeight: _minimumHeight,
    closeThreshold: _closeThreshold,
    backdrop: backdropEnabled = true,
    recyclerListView = false,
    recyclerListViewProps = {} as RecyclerListViewProps,
    backgroundColor = 'default',
    topColor = 'paper',
  } = props;
  const deviceOrientation = useSelector((state: AppState) => state.settings.deviceOrientation);

  const { height } = useWindowDimensions();
  const minimumHeight = React.useMemo(() => {
    switch (deviceOrientation) {
      case Orientation.LANDSCAPE_LEFT:
      case Orientation.LANDSCAPE_RIGHT:
        return (_minimumHeight ?? height) * 0.7;
      default:
        return _minimumHeight ?? height * 0.5;
    }
  }, [height, _minimumHeight, deviceOrientation]);
  const CLOSE_THRESHOLD = height * 0.8;
  const closeThreshold = CLOSE_THRESHOLD;
  const MAX_PANEL_HEIGHT = StatusBar.currentHeight ?? 0;
  const APPROACHING_TOP = MAX_PANEL_HEIGHT + 20;
  const scrollRef = React.useRef<ScrollView>(null);
  const recyclerRef = React.useRef<RecyclerListView<any, any>>(null);
  const theme = useTheme();
  const backdrop = useSharedValue(0);
  const top = useSharedValue(height + MAX_PANEL_HEIGHT);
  const borderRadius = useSharedValue(theme.borderRadius);
  const statusBarHeight = useSharedValue(0);
  const [hasTouched, setHasTouched] = React.useState<boolean>(false);
  const pointerEvents = React.useMemo(() => (visible ? 'auto' : 'box-none'), [visible]);
  const [scrollEnabled, setScrollEnabled] = React.useState<boolean>(false);
  function handleVelocityBehavior(topValue: number) {
    if (topValue <= MAX_PANEL_HEIGHT) {
      setScrollEnabled(true);
    } else setScrollEnabled(false);
  }

  const gestureHandlers = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, GestureContext>({
    onActive: (e, ctx) => {
      const val = Math.min(Math.max(e.translationY + ctx.translateY, MAX_PANEL_HEIGHT), closeThreshold);
      top.value = val;
      runOnJS(handleVelocityBehavior)(val);
    },
    onStart: (e, ctx) => {
      runOnJS(setHasTouched)(true);
      ctx.translateY = top.value;
    },
    onEnd: (e) => {
      top.value = withDecay(
        {
          velocity: e.velocityY,
          deceleration: 0.997,
          clamp: [MAX_PANEL_HEIGHT, closeThreshold],
        },
        () => {
          runOnJS(handleVelocityBehavior)(top.value);
        }
      );
    },
  });

  function effects() {
    if (visible) {
      backdrop.value = withTiming(1, { duration: 200, easing: Easing.ease });
      top.value = withTiming(minimumHeight, { duration: 300, easing: Easing.ease });
    } else {
      backdrop.value = withTiming(0, { duration: 200, easing: Easing.ease });
      setTimeout(() => {
        top.value = withTiming(height + MAX_PANEL_HEIGHT, { duration: 200, easing: Easing.ease });
      }, 100);
    }
  }

  React.useEffect(() => {
    runOnUI(effects)();
    if (visible) {
      const t = BackHandler.addEventListener('hardwareBackPress', () => {
        handleOnClose();

        return true;
      });
      return () => {
        t.remove();
        // cancelAnimation(backdrop);
        // cancelAnimation(top);
      };
    }
    // return () => {
    //   cancelAnimation(backdrop);
    //   cancelAnimation(top);
    // };
  }, [visible, deviceOrientation]);

  const panelStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: top.value }],
  }));
  const containerStyle = useAnimatedStyle(() => ({
    borderTopLeftRadius: borderRadius.value,
    borderTopRightRadius: borderRadius.value,
    borderTopWidth: borderRadius.value,
  }));

  const statusBarStyle = useAnimatedStyle(() => ({
    height: statusBarHeight.value,
  }));

  const style = useAnimatedStyle(() => ({
    opacity: backdrop.value,
  }));

  const handleOnClose = () => {
    onClose();
    setHasTouched(false);
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    recyclerRef.current?.scrollToTop(true);
  };

  useDerivedValue(() => {
    if (hasTouched && closeThreshold <= top.value) runOnJS(handleOnClose)();
    if (top.value <= APPROACHING_TOP) borderRadius.value = withTiming(0, { duration: 200, easing: Easing.ease });
    else borderRadius.value = withTiming(theme.borderRadius, { duration: 200, easing: Easing.ease });
    if (top.value <= MAX_PANEL_HEIGHT)
      statusBarHeight.value = withTiming(MAX_PANEL_HEIGHT, { duration: 200, easing: Easing.ease });
    else statusBarHeight.value = withTiming(0, { duration: 200, easing: Easing.ease });
  }, [top.value]);

  function onScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const { velocity, contentOffset } = e.nativeEvent;
    if (velocity) setScrollEnabled(!(velocity.y <= 0.5 && contentOffset.y <= 0));
  }

  return (
    <Portal>
      {backdropEnabled && (
        <BackdropContainer style={style} pointerEvents={pointerEvents}>
          <BackdropPressable visible={visible} onPress={handleOnClose} touchSoundDisabled />
        </BackdropContainer>
      )}
      <StatusBarFiller style={statusBarStyle} />
      <PanGestureHandler enabled={visible} onGestureEvent={gestureHandlers}>
        <Panel style={panelStyle}>
          <ModalContainer modalBackgroundColor={backgroundColor} modalTopColor={topColor} style={containerStyle}>
            {recyclerListView ? (
              <RecyclerListView
                {...recyclerListViewProps}
                externalScrollView={ScrollView as any}
                ref={recyclerRef}
                scrollViewProps={{
                  onScroll,
                  scrollEnabled,
                  contentContainerStyle: {
                    minHeight: height,
                    paddingBottom: MAX_PANEL_HEIGHT + pixelToNumber(theme.spacing(12)),
                  },
                }}
              />
            ) : (
              <ScrollView
                ref={scrollRef}
                onScroll={onScroll}
                scrollEnabled={scrollEnabled}
                contentContainerStyle={{
                  backgroundColor: theme.palette.background[backgroundColor].get(),
                  minHeight: height,
                  paddingBottom: MAX_PANEL_HEIGHT + pixelToNumber(theme.spacing(12)),
                }}>
                {children}
              </ScrollView>
            )}
          </ModalContainer>
        </Panel>
      </PanGestureHandler>
    </Portal>
  );
};

export default Modal;
