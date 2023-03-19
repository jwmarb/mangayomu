import React from 'react';
import { ButtonProps } from './Button.interfaces';
import { TouchableOpacity } from 'react-native';
import { BaseButton } from 'react-native-gesture-handler';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import Box from '@components/Box';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import { hexToRgb, rgbaToString } from '@mangayomu/theme';
import Stack from '@components/Stack';

const Button: React.FC<ButtonProps> = (props) => {
  const {
    label,
    variant,
    color = 'primary',
    disabled = false,
    icon,
    iconPlacement = 'left',
    ...rest
  } = props;
  const theme = useTheme();
  return (
    <BaseButton
      disallowInterruption
      enabled={!disabled}
      style={{
        borderRadius: theme.style.borderRadius,
        backgroundColor:
          variant === 'contained'
            ? disabled
              ? theme.palette.text.disabled
              : theme.palette[color].main
            : undefined,
      }}
      {...rest}
      rippleColor={theme.palette[color].ripple}
    >
      <Stack
        space={moderateScale(4)}
        py={moderateScale(12)}
        px={moderateScale(16)}
        border-width={1.5}
        border-radius="@theme"
        flex-direction="row"
        align-items="center"
        justify-content="center"
        {...(variant === 'outline'
          ? {
              'border-color': disabled ? theme.palette.text.disabled : color,
            }
          : {
              'border-color': 'transparent',
            })}
      >
        {iconPlacement === 'left' &&
          icon &&
          React.cloneElement(icon, {
            color: disabled
              ? 'disabled'
              : variant === 'contained'
              ? {
                  custom: theme.helpers.getContrastText(
                    theme.palette[color].main,
                  ),
                }
              : color,
          })}
        {label && (
          <Text
            variant="button"
            align="center"
            bold
            color={
              disabled
                ? 'disabled'
                : variant === 'contained'
                ? {
                    custom: theme.helpers.getContrastText(
                      theme.palette[color].main,
                    ),
                  }
                : color
            }
          >
            {label}
          </Text>
        )}
        {iconPlacement === 'right' &&
          icon &&
          React.cloneElement(icon, {
            color: disabled
              ? 'disabled'
              : variant === 'contained'
              ? {
                  custom: theme.helpers.getContrastText(
                    theme.palette[color].main,
                  ),
                }
              : color,
          })}
      </Stack>
    </BaseButton>
  );
};

export default Button;
