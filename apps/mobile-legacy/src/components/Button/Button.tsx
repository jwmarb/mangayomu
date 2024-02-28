import React from 'react';
import { ButtonProps } from './';
import { moderateScale } from 'react-native-size-matters';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import Stack from '@components/Stack';
import Box from '@components/Box/Box';
import Pressable from '@components/Pressable';

const SPACE = moderateScale(4);
const PY = moderateScale(12);
const PX = moderateScale(16);

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
  const borderColor =
    variant === 'outline' ? (disabled ? 'disabled' : color) : 'transparent';

  const textColor = disabled
    ? 'disabled'
    : variant === 'contained'
    ? theme.helpers.getContrastText(theme.palette[color].main)
    : color;

  const containerStyle = {
    borderRadius: sharp ? undefined : theme.style.borderRadius,
    backgroundColor:
      variant === 'contained'
        ? disabled
          ? theme.palette.text.disabled
          : theme.palette[color].main
        : undefined,
  };

  const boxStyle = [style, containerStyle];

  return (
    <Box overflow="hidden" style={boxStyle}>
      <Pressable disabled={disabled} color={color} {...rest}>
        <Stack
          space={SPACE}
          py={PY}
          px={PX}
          flex-direction="row"
          align-items="center"
          justify-content="center"
          border-width="@theme"
          border-radius="@theme"
          border-color={borderColor}
        >
          {iconPlacement === 'left' &&
            icon &&
            React.cloneElement(icon, {
              color: textColor,
            })}
          {label && (
            <Text variant="button" align="center" bold color={textColor}>
              {label}
            </Text>
          )}
          {iconPlacement === 'right' &&
            icon &&
            React.cloneElement(icon, {
              color: textColor,
            })}
        </Stack>
      </Pressable>
    </Box>
  );
};

export default Button;
