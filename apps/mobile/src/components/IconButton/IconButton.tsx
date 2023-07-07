import Box from '@components/Box';
import { generateRippleColor } from '@components/IconButton/IconButton.helpers';
import { useTheme } from '@emotion/react';
import { ButtonColors } from '@mangayomu/theme';
import React from 'react';
import {
  BorderlessButton,
  TouchableNativeFeedback,
} from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import { IconButtonProps } from './IconButton.interfaces';
import { Pressable } from 'react-native';

const IconButton: React.FC<IconButtonProps> = (props) => {
  const {
    color = 'textSecondary',
    icon,
    compact,
    animated,
    rippleColor: defaultRippleColor,
    ...rest
  } = props;
  const theme = useTheme();
  const rippleColor = React.useMemo(() => {
    if (defaultRippleColor != null) return defaultRippleColor;
    if (color in theme.palette)
      return theme.palette[color as ButtonColors].ripple;
    return theme.palette.action.ripple;
  }, [color, theme, defaultRippleColor]);

  const borderlessButtonStyle = React.useMemo(
    () =>
      ({
        width: moderateScale(48),
        height: moderateScale(48),
        alignItems: 'center',
        justifyContent: 'center',
      } as const),
    [compact],
  );
  return (
    <Box
      align-self="center"
      width={borderlessButtonStyle.width}
      height={borderlessButtonStyle.height}
      border-radius={10000}
    >
      <Pressable
        android_ripple={{
          borderless: true,
          color: rippleColor,
          radius: compact ? moderateScale(18) : undefined,
        }}
        style={borderlessButtonStyle}
        {...rest}
      >
        {icon &&
          React.cloneElement(icon, { variant: 'icon-button', color, animated })}
      </Pressable>
    </Box>
  );
};

export default IconButton;
