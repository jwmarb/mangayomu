import Button from '@components/Button';
import Flex from '@components/Flex';
import {
  BackdropContainer,
  BackdropPressable,
  ModalContainer,
  Panel,
  StatusBarFiller,
} from '@components/Modal/Modal.base';
import { ModalProps } from '@components/Modal/Modal.interfaces';
import { Typography } from '@components/Typography';
import { Portal } from '@gorhom/portal';
import React from 'react';
import {
  Dimensions,
  GestureResponderEvent,
  LayoutChangeEvent,
  Modal as DefaultModal,
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
  State,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Animated, {
  call,
  Easing,
  useAnimatedStyle,
  useCode,
  useSharedValue,
  Value,
  withDecay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import SlidingUpPanel from 'rn-sliding-up-panel';
import { useTheme } from 'styled-components/native';
const { height } = Dimensions.get('window');

const CLOSE_THRESHOLD = height - 100;
const MAX_PANEL_HEIGHT = StatusBar.currentHeight ?? 0;

const Modal: React.FC<ModalProps> = (props) => {
  const { onClose, visible, children } = props;
  const theme = useTheme();
  const backdrop = useSharedValue(0);
  const top = useSharedValue(height);
  const borderRadius = useSharedValue(theme.borderRadius);
  const statusBarHeight = useSharedValue(0);
  const pointerEvents = React.useMemo(() => (visible ? 'auto' : 'box-none'), [visible]);
  React.useEffect(() => {
    if (visible) {
      backdrop.value = withTiming(1, { duration: 200, easing: Easing.ease });
      top.value = withSpring(height / 1.5);
    } else {
      backdrop.value = withTiming(0, { duration: 200, easing: Easing.ease });
      top.value = withTiming(height + MAX_PANEL_HEIGHT, { duration: 200, easing: Easing.ease });
    }
  }, [visible]);

  const panelStyle = useAnimatedStyle(() => ({
    top: top.value,
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

  function handleOnGestureEvent(e: GestureEvent<PanGestureHandlerEventPayload>) {
    if (e.nativeEvent.numberOfPointers === 1) {
      // const pos = Math.max(e.nativeEvent.y, MAX_PANEL_HEIGHT);
      const pos = withDecay({
        velocity: e.nativeEvent.velocityY * 2,
        deceleration: 1,
        clamp: [MAX_PANEL_HEIGHT, height],
      });
      top.value = pos;
      if (top.value > height - 20) onClose();

      if (top.value < MAX_PANEL_HEIGHT + 20) borderRadius.value = withSpring(0);
      else borderRadius.value = withSpring(theme.borderRadius);
      if (top.value <= MAX_PANEL_HEIGHT)
        statusBarHeight.value = withTiming(MAX_PANEL_HEIGHT + 1, { duration: 200, easing: Easing.ease });
      else statusBarHeight.value = withTiming(0, { duration: 200, easing: Easing.ease });
    }
  }

  function handleOnEnded(e: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) {
    if (e.nativeEvent.numberOfPointers === 1) {
      const velocity = e.nativeEvent.velocityY / 3;
      if (velocity <= -height && top.value <= height / 3) borderRadius.value = withSpring(0);
      if ((top.value >= CLOSE_THRESHOLD && velocity > 0) || top.value - velocity <= -800) onClose();
      top.value = withDecay(
        {
          velocity,
          deceleration: 0.997,
          clamp: [MAX_PANEL_HEIGHT, height],
        },
        (isDone) => {
          if (top.value <= MAX_PANEL_HEIGHT) {
            statusBarHeight.value = withTiming(MAX_PANEL_HEIGHT + 1, { duration: 50, easing: Easing.ease });
            borderRadius.value = withSpring(0);
          }
        }
      );
    }
  }

  return (
    <Portal>
      <BackdropContainer style={style} pointerEvents={pointerEvents}>
        <BackdropPressable visible={visible} onPress={onClose} touchSoundDisabled />
      </BackdropContainer>
      <StatusBarFiller style={statusBarStyle} />
      <PanGestureHandler onGestureEvent={handleOnGestureEvent} onEnded={handleOnEnded as any}>
        <Panel style={panelStyle}>
          <ModalContainer style={containerStyle}>{children}</ModalContainer>
        </Panel>
      </PanGestureHandler>
    </Portal>
  );
};

export default Modal;
