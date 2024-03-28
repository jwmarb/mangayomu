import React from 'react';
import { BackHandler, Keyboard } from 'react-native';
import { Freeze } from 'react-freeze';
import { Portal } from '@gorhom/portal';
import Animated, {
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import Header from '@/components/composites/Modal/components/Header';
import Content from '@/components/composites/Modal/components/Content';
import useBoolean from '@/hooks/useBoolean';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/components/composites/Modal/styles';
import useContrast from '@/hooks/useContrast';
import AnimatedNativePressable from '@/components/animated/NativePressable';
import FlatList from '@/components/composites/Modal/components/FlatList';

export type Modal = {
  show(): void;
  hide(): void;
};

type ModalProps = {
  contrast?: boolean;
};

type ModalComponent = {
  Header: typeof Header;
  Content: typeof Content;
  FlatList: typeof FlatList;
};

function ModalComponent(
  { children, contrast: contrastProp }: React.PropsWithChildren<ModalProps>,
  ref: React.ForwardedRef<Modal>,
) {
  const [isHidden, toggle] = useBoolean(true);
  const opacity = useSharedValue(0);
  const offset = useSharedValue(0);
  const contrast = useContrast(contrastProp);
  const style = useStyles(styles, contrast);
  const animatedBackdropStyle = useAnimatedStyle(
    () => ({
      opacity: opacity.value,
    }),
    [],
  );
  const animatedOffsetStyle = useAnimatedStyle(
    () => ({
      bottom: offset.value,
    }),
    [],
  );

  const backdropStyle = [style.backdrop, animatedBackdropStyle];
  const modalStyle = [style.modal, animatedBackdropStyle, animatedOffsetStyle];
  useAnimatedReaction(
    () => opacity.value,
    (currentOpacity) => {
      if (currentOpacity === 0) runOnJS(toggle)(true);
      else runOnJS(toggle)(false);
    },
    [toggle],
  );

  function show() {
    'worklet';
    opacity.value = withTiming(1, { duration: 200 });
  }
  function hide() {
    'worklet';
    opacity.value = withTiming(0, { duration: 200 });
  }

  React.useImperativeHandle(ref, () => ({
    show,
    hide,
  }));

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (!isHidden) {
          hide();
          return true;
        }
        return false;
      },
    );

    return () => {
      subscription.remove();
    };
  }, [isHidden]);

  React.useEffect(() => {
    const keyboardSubscription1 = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        offset.value = e.endCoordinates.height; // this might render offscreen
      },
    );
    const keyboardSubscription2 = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        offset.value = 0;
      },
    );
    return () => {
      keyboardSubscription1.remove();
      keyboardSubscription2.remove();
    };
  }, []);

  return (
    <Portal>
      <Freeze freeze={isHidden}>
        <AnimatedNativePressable onPress={hide} style={backdropStyle} />
        <Animated.View style={modalStyle} pointerEvents="box-none">
          {children}
        </Animated.View>
      </Freeze>
    </Portal>
  );
}

export const Modal = React.forwardRef(ModalComponent) as ReturnType<
  typeof React.forwardRef<Modal, React.PropsWithChildren<ModalProps>>
> &
  ModalComponent;
Modal.Header = Header;
Modal.Content = Content;
Modal.FlatList = FlatList;
