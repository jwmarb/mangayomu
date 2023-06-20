import Box from '@components/Box';
import {
  ModalBuilderMethods,
  ModalBuilderProps,
} from './ModalBuilder.interfaces';
import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import useBoolean from '@hooks/useBoolean';
import Overlay from '@components/Overlay/Overlay';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const ModalBuilder: React.ForwardRefRenderFunction<
  ModalBuilderMethods,
  ModalBuilderProps
> = (props: ModalBuilderProps, ref) => {
  const { trigger, title, children, onTrigger } = props;
  const [visible, toggle] = useBoolean();
  function handleOnRequestClose() {
    toggle(false);
  }
  function handleOnOpen() {
    toggle(true);
  }
  React.useImperativeHandle(ref, () => ({
    close: handleOnRequestClose,
  }));
  return (
    <>
      <TouchableWithoutFeedback onPress={handleOnOpen}>
        {trigger}
      </TouchableWithoutFeedback>
      <Modal
        visible={visible}
        onShow={onTrigger}
        onRequestClose={handleOnRequestClose}
        statusBarTranslucent
        animationType="fade"
        transparent
      >
        <GestureHandlerRootView>
          <Overlay onPress={handleOnRequestClose} />
          <Box
            position="absolute"
            left={0}
            right={0}
            top={0}
            bottom={0}
            align-items="center"
            justify-content="center"
            pointerEvents="box-none"
          >
            <Stack
              space="s"
              background-color="paper"
              border-color="@theme"
              border-radius="@theme"
              border-width="@theme"
              m="m"
            >
              <Box py="m" px="l">
                <Text variant="header">{title}</Text>
              </Box>
              {children}
            </Stack>
          </Box>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
};

export default React.forwardRef(ModalBuilder);
