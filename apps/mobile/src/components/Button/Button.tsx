import React from 'react';
import { ButtonProps } from './';
import { moderateScale } from 'react-native-size-matters';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import Stack from '@components/Stack';
import Box from '@components/Box/Box';
import Pressable from '@components/Pressable';

const Button: React.FC<ButtonProps> = (props) => {
  const {
    label,
    variant,
    color = 'primary',
    disabled = false,
    icon,
    iconPlacement = 'left',
    sharp = false,
    style,
    ...rest
  } = props;
  const theme = useTheme();
  return (
    <Box
      overflow="hidden"
      style={[
        style,
        {
          borderRadius: sharp ? undefined : theme.style.borderRadius,
          backgroundColor:
            variant === 'contained'
              ? disabled
                ? theme.palette.text.disabled
                : theme.palette[color].main
              : undefined,
        },
      ]}
    >
      <Pressable disabled={disabled} color={color} {...rest}>
        <Stack
          space={moderateScale(4)}
          py={moderateScale(12)}
          px={moderateScale(16)}
          flex-direction="row"
          align-items="center"
          justify-content="center"
          border-width="@theme"
          border-radius="@theme"
          border-color={
            variant === 'outline'
              ? disabled
                ? 'disabled'
                : color
              : 'transparent'
          }
        >
          {iconPlacement === 'left' &&
            icon &&
            React.cloneElement(icon, {
              color: disabled
                ? 'disabled'
                : variant === 'contained'
                ? theme.helpers.getContrastText(theme.palette[color].main)
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
                  ? theme.helpers.getContrastText(theme.palette[color].main)
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
                ? theme.helpers.getContrastText(theme.palette[color].main)
                : color,
            })}
        </Stack>
      </Pressable>
    </Box>
  );
};

export default Button;
