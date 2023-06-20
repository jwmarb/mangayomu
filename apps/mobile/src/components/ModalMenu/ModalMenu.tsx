import Box from '@components/Box';
import { ModalMenuProps } from './ModalMenu.interfaces';
import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { Modal, TouchableWithoutFeedback } from 'react-native';
import {
  GestureHandlerRootView,
  RectButton,
} from 'react-native-gesture-handler';
import useBoolean from '@hooks/useBoolean';
import RadioGroup from '@components/RadioGroup';
import Radio from '@components/Radio';
import Overlay from '@components/Overlay/Overlay';

function ModalMenu<T>(props: ModalMenuProps<T>) {
  const { onChange, value, trigger, enum: standardEnum, title } = props;
  const [visible, toggle] = useBoolean();
  function handleOnRequestClose() {
    toggle(false);
  }
  function handleOnOpen() {
    toggle(true);
  }
  return (
    <>
      <TouchableWithoutFeedback onPress={handleOnOpen}>
        {trigger}
      </TouchableWithoutFeedback>
      <Modal
        visible={visible}
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
            bottom={0}
            top={0}
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
              <Box justify-content="flex-start">
                <RadioGroup value={value} onChange={onChange}>
                  {Object.values(standardEnum).map((x) => (
                    <RectButton
                      key={x as string}
                      onPress={() => {
                        onChange(x);
                      }}
                    >
                      <Box m="m" align-items="flex-start">
                        <Radio value={x} label={x as string} />
                      </Box>
                    </RectButton>
                  ))}
                </RadioGroup>
              </Box>
            </Stack>
          </Box>
        </GestureHandlerRootView>
      </Modal>
    </>
  );
}

export default ModalMenu;
