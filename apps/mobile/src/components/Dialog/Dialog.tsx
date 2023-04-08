import Box, { AnimatedBox } from '@components/Box';
import Button from '@components/Button';
import Stack from '@components/Stack';
import Text from '@components/Text';
import useBoolean from '@hooks/useBoolean';
import { DialogContext } from '@hooks/useDialog';
import React from 'react';
import {
  BackHandler,
  Modal,
  TouchableNativeFeedback,
  useWindowDimensions,
} from 'react-native';
import {
  Easing,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  gestureHandlerRootHOC,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import {
  DialogAction,
  DialogMethods,
  DialogOptions,
} from './Dialog.interfaces';

const actionsDefaultState: DialogAction[] = [{ text: 'Close' }];

const Dialog: React.ForwardRefRenderFunction<DialogMethods> = (props, ref) => {
  const [show, setShow] = useBoolean();
  const { width, height } = useWindowDimensions();
  const [actions, setActions] =
    React.useState<DialogAction[]>(actionsDefaultState);
  const [text, setText] = React.useState<string>('');
  const [title, setTitle] = React.useState<string>('');
  const close = () => {
    setShow(false);
    resetStates();
  };
  function resetStates() {
    setText('');
    setTitle('');
    setActions(actionsDefaultState);
  }

  const open = (options: DialogOptions) => {
    setTitle(options.title ?? '');
    setText(options.message);
    setActions(options.actions ?? actionsDefaultState);
    setShow(true);
  };

  React.useImperativeHandle(ref, () => ({
    open,
  }));

  return (
    <Modal
      transparent
      visible={show}
      onRequestClose={close}
      animationType="fade"
    >
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Box
          pointerEvents={show ? 'auto' : 'none'}
          width="100%"
          height="100%"
          z-index={1000}
          position="absolute"
          background-color="rgba(0, 0, 0, 0.7)"
          flex-grow
          top={0}
          left={0}
          right={0}
          bottom={0}
          align-items="center"
          justify-content="center"
        >
          <Box
            background-color="paper"
            flex-shrink
            align-self="center"
            p="m"
            m="m"
            border-radius="@theme"
          >
            <Stack space="s">
              <Text variant="header" bold>
                {title}
              </Text>
              <Text color="textSecondary">{text}</Text>
              <Stack space="s" flex-direction="row" justify-content="flex-end">
                {/* {actions.map((x, i) => (
                <TouchableNativeFeedback
                  key={i}
                  onPress={() => {
                    console.log('pressed');
                  }}
                >
                  <Text>{x.text}</Text>
                </TouchableNativeFeedback>
              ))} */}
                {actions.map((x, i) => (
                  <Button
                    key={i}
                    label={x.text}
                    onPress={() => {
                      if (x.onPress != null) x.onPress();
                      close();
                    }}
                    variant={x.variant}
                    color={x.type === 'destructive' ? 'error' : undefined}
                  />
                ))}
              </Stack>
            </Stack>
          </Box>
        </Box>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default React.memo(React.forwardRef(Dialog));
