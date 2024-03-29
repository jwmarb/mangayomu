import Box from '@components/Box';
import Icon from '@components/Icon';
import Stack from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import { PressableListItemProps } from './PressableListItem.interfaces';
import Pressable from '@components/Pressable';
import { useTheme } from '@emotion/react';

const PressableListItem: React.FC<PressableListItemProps> = (props) => {
  const {
    label,
    iconLeft,
    iconRight = <Icon type="font" name="chevron-right" />,
    onPress,
  } = props;
  const theme = useTheme();
  return (
    <Pressable onPress={onPress}>
      <Stack
        mx="l"
        my="s"
        space="s"
        flex-direction="row"
        align-items="center"
        justify-content="space-between"
      >
        <Stack flex-direction="row" align-items="center" space="m">
          <Box
            background-color="disabled"
            align-items="center"
            p="s"
            border-radius={moderateScale(4)}
            align-self="center"
          >
            {iconLeft != null &&
              React.cloneElement(iconLeft, {
                color: theme.helpers.getContrastText(
                  theme.palette.background.disabled,
                ),
              })}
          </Box>
          <Text>{label}</Text>
        </Stack>
        {iconRight}
      </Stack>
    </Pressable>
  );
};

export default React.memo(PressableListItem);
