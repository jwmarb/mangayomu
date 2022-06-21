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
import pixelToNumber from '@utils/pixelToNumber';
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
} from 'react-native-gesture-handler';
import Animated, {
  call,
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
import { useTheme } from 'styled-components/native';
const { height } = Dimensions.get('window');

const CLOSE_THRESHOLD = height - 200;
const MAX_PANEL_HEIGHT = StatusBar.currentHeight ?? 0;
const APPROACHING_TOP = MAX_PANEL_HEIGHT + 20;

const Modal: React.FC<ModalProps> = (props) => {
  const {
    onClose,
    visible,
    children,
    minimumHeight = height * 0.5,
    closeThreshold = CLOSE_THRESHOLD,
    backdrop: backdropEnabled = true,
  } = props;
  const scrollRef = React.useRef<ScrollView>(null);
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
      top.value = withSpring(minimumHeight);
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
      };
    }
  }, [visible]);

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
          <ModalContainer style={containerStyle}>
            <ScrollView
              ref={scrollRef}
              onScroll={onScroll}
              scrollEnabled={scrollEnabled}
              contentContainerStyle={{
                minHeight: height,
                paddingBottom: MAX_PANEL_HEIGHT + pixelToNumber(theme.spacing(12)),
              }}>
              {children}
            </ScrollView>
          </ModalContainer>
        </Panel>
      </PanGestureHandler>
    </Portal>
  );
};

export default Modal;
