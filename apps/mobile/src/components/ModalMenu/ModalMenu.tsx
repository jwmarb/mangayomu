import Box from '@components/Box';
import { ModalMenuProps } from './';
import React from 'react';
import RadioGroup from '@components/RadioGroup';
import Radio from '@components/Radio';
import { useTheme } from '@emotion/react';
import ModalBuilder from '@components/ModalBuilder/ModalBuilder';
import { ModalBuilderMethods } from '@components/ModalBuilder';
import { Pressable } from 'react-native';

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
            <Pressable
              android_ripple={{
                color: theme.palette.action.ripple,
              }}
              key={x as string}
              onPress={() => {
                ref.current?.close();
                onChange(x);
              }}
            >
              <Box m="m" align-items="flex-start">
                <Radio value={x} label={x as string} onPress={onPress} />
              </Box>
            </Pressable>
          ))}
        </RadioGroup>
      </Box>
    </ModalBuilder>
  );
}

export default ModalMenu;
