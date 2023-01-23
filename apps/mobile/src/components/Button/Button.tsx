import React from 'react';
import { ButtonProps } from './Button.interfaces';
import { TouchableOpacity } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import Box from '@components/Box';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';

const Button: React.FC<ButtonProps> = (props) => {
  const {
    label,
    variant,
    color = 'primary',
    disabled = false,
    ...rest
  } = props;
  const theme = useTheme();
  return (
    <BaseButton
      enabled={!disabled}
      style={{
        borderRadius: theme.style.borderRadius,
        backgroundColor:
          variant === 'contained' ? theme.palette[color].main : undefined,
      }}
      {...rest}
      rippleColor={theme.palette[color][theme.mode ?? 'main']}
    >
      <Box
        py={moderateScale(12)}
        px={moderateScale(16)}
        border-width={1.5}
        border-radius="@theme"
        {...(variant === 'outline'
          ? {
              'border-color': disabled ? theme.palette.text.disabled : color,
            }
          : {
              'border-color': 'transparent',
            })}
      >
        <Text
          variant="button"
          align="center"
          bold
          color={
            disabled
              ? 'disabled'
              : variant === 'contained'
              ? 'primary@contrast'
              : 'primary'
          }
        >
          {label}
        </Text>
      </Box>
    </BaseButton>
  );
};

export default Button;
