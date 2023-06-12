import Box from '@components/Box';
import { generateRippleColor } from '@components/IconButton/IconButton.helpers';
import { useTheme } from '@emotion/react';
import { ButtonColors } from '@mangayomu/theme';
import React from 'react';
import { BorderlessButton } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import { IconButtonProps } from './IconButton.interfaces';

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
    if (typeof color === 'object') return generateRippleColor(color.custom);
    if (color in theme.palette)
      return theme.palette[color as ButtonColors].ripple;
    return theme.palette.action.ripple;
  }, [color, theme, defaultRippleColor]);

  const borderlessButtonStyle = React.useMemo(
    () =>
      ({
        width: moderateScale(compact ? 32 : 48),
        height: moderateScale(compact ? 32 : 48),
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
      <BorderlessButton
        disallowInterruption
        shouldCancelWhenOutside
        style={borderlessButtonStyle}
        rippleColor={rippleColor}
        {...rest}
      >
        {icon &&
          React.cloneElement(icon, { variant: 'icon-button', color, animated })}
      </BorderlessButton>
    </Box>
  );
};

export default IconButton;
