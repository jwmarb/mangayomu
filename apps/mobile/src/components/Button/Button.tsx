import React from 'react';
import { ButtonProps } from './Button.interfaces';
import { BaseButton } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import Stack from '@components/Stack';
import Box from '@components/Box/Box';

const Button: React.FC<ButtonProps> = (props) => {
  const {
    label,
    variant,
    color = 'primary',
    disabled = false,
    icon,
    iconPlacement = 'left',
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
          borderRadius: theme.style.borderRadius,
          backgroundColor:
            variant === 'contained'
              ? disabled
                ? theme.palette.text.disabled
                : theme.palette[color].main
              : undefined,
        },
      ]}
    >
      <BaseButton
        shouldCancelWhenOutside
        disallowInterruption
        enabled={!disabled}
        {...rest}
        rippleColor={theme.palette[color].ripple}
      >
        <Stack
          space={moderateScale(4)}
          py={moderateScale(12)}
          px={moderateScale(16)}
          flex-direction="row"
          align-items="center"
          justify-content="center"
          border-width="@theme"
          border-radius="@theme"
          style={{
            borderColor:
              variant === 'outline'
                ? disabled
                  ? theme.palette.text.disabled
                  : theme.helpers.getColor(color)
                : 'transparent',
          }}
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
    </Box>
  );
};

export default Button;
