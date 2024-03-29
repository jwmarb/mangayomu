import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { TagProps } from './';
import Box from '@components/Box';
import Pressable from '@components/Pressable';

const Tag: React.FC<TagProps> = (props) => {
  const { label, icon, color = 'textPrimary' } = props;
  const theme = useTheme();
  const baseButtonStyle = React.useMemo(
    () => ({ borderRadius: theme.style.borderRadius }),
    [theme.style.borderRadius],
  );
  function handleOnPress() {
    if ('id' in props) props.onPress && props.onPress(props.id);
  }
  return (
    <Pressable onPress={handleOnPress} style={baseButtonStyle}>
      <Box
        px={moderateScale(10)}
        py={moderateScale(5)}
        border-radius="@theme"
        background-color={
          theme.mode === 'dark'
            ? 'rgba(255, 255, 255, 0.1)'
            : 'rgba(0, 0, 0, 0.1)'
        }
      >
        <Stack space="s" flex-direction="row">
          {icon}
          <Text variant="button" color={color}>
            {label}
          </Text>
        </Stack>
      </Box>
    </Pressable>
  );
};

export default React.memo(Tag);
