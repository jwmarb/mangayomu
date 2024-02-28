import React from 'react';
import { FieldProps } from './';
import Stack from '@components/Stack';
import Text from '@components/Text';
import Input from '@components/Input';
import Box from '@components/Box';
import { useTheme } from '@emotion/react';
import { Pressable } from 'react-native';

const Field: React.FC<FieldProps> = (props) => {
  const { label, error, ...rest } = props;
  const theme = useTheme();
  const inputRef = React.useRef<React.ElementRef<typeof Input>>(null);

  const handleOnPress = () => {
    inputRef.current?.focus();
  };

  if (error)
    return (
      <Stack space={theme.style.spacing.s / 2}>
        <Stack space="s" flex-shrink>
          <Pressable onPress={handleOnPress}>
            <Text>{label}</Text>
          </Pressable>
          <Input ref={inputRef} expanded placeholder={label} error {...rest} />
        </Stack>
        {typeof error === 'string' && (
          <Text variant="body-sub" color="error">
            {error}
          </Text>
        )}
      </Stack>
    );
  return (
    <Stack space="s">
      <Pressable onPress={handleOnPress}>
        <Text>{label}</Text>
      </Pressable>
      <Input ref={inputRef} expanded placeholder={label} {...rest} />
    </Stack>
  );
};

export default Field;
