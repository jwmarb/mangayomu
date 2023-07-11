import React from 'react';
import { FieldProps } from './';
import Stack from '@components/Stack';
import Text from '@components/Text';
import Input from '@components/Input';
import Box from '@components/Box';
import { useTheme } from '@emotion/react';

const Field: React.FC<FieldProps> = (props) => {
  const { onChange, label, error, ...rest } = props;
  const theme = useTheme();
  if (error)
    return (
      <Stack space={theme.style.spacing.s / 2}>
        <Stack space="s">
          <Text>{label}</Text>
          <Input width="100%" placeholder={label} error {...rest} />
        </Stack>
        <Text variant="body-sub" color="error">
          {error}
        </Text>
      </Stack>
    );
  return (
    <Stack space="s">
      <Text>{label}</Text>
      <Input width="100%" placeholder={label} {...rest} />
    </Stack>
  );
};

export default Field;
