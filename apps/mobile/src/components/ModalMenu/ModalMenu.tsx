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
import { useTheme } from '@emotion/react';
import ModalBuilder from '@components/ModalBuilder/ModalBuilder';
import { ModalBuilderMethods } from '@components/ModalBuilder/ModalBuilder.interfaces';

function ModalMenu<T>(props: ModalMenuProps<T>) {
  const { onChange, value, trigger, enum: standardEnum, title } = props;
  const theme = useTheme();
  const ref = React.useRef<ModalBuilderMethods>(null);
  const onPress = React.useCallback(() => {
    ref.current?.close();
  }, []);
  return (
    <ModalBuilder title={title} trigger={trigger} ref={ref}>
      <Box justify-content="flex-start">
        <RadioGroup value={value} onChange={onChange}>
          {Object.values(standardEnum).map((x) => (
            <RectButton
              key={x as string}
              onPress={() => {
                ref.current?.close();
                onChange(x);
              }}
              rippleColor={theme.palette.action.ripple}
            >
              <Box m="m" align-items="flex-start">
                <Radio value={x} label={x as string} onPress={onPress} />
              </Box>
            </RectButton>
          ))}
        </RadioGroup>
      </Box>
    </ModalBuilder>
  );
}

export default ModalMenu;
