import Box from '@components/Box';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import React from 'react';
import { BaseButton } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import { TagProps } from './Tag.interfaces';

const Tag: React.FC<TagProps> = (props) => {
  const { label, icon, color = 'textPrimary', onPress } = props;
  const theme = useTheme();
  const baseButtonStyle = React.useMemo(
    () => ({ borderRadius: theme.style.borderRadius }),
    [theme.style.borderRadius],
  );
  return (
    <BaseButton
      onPress={onPress}
      style={baseButtonStyle}
      rippleColor={
        color === 'primary' || color === 'secondary'
          ? theme.palette[color].ripple
          : theme.palette.action.ripple
      }
    >
      <Stack
        space="s"
        flex-direction="row"
        px={moderateScale(10)}
        py={moderateScale(5)}
        border-width={moderateScale(1.5)}
        border-color={
          color === 'textPrimary' || color === 'textSecondary'
            ? theme.palette.borderColor
            : theme.helpers.getColor(color)
        }
        border-radius="@theme"
      >
        {icon}
        <Text variant="button" color={color}>
          {label}
        </Text>
      </Stack>
    </BaseButton>
  );
};

export default React.memo(Tag);
