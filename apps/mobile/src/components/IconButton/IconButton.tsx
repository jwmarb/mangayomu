import Box from '@components/Box';
import Icon from '@components/Icon';
import { useTheme } from '@emotion/react';
import { ButtonColors } from '@mangayomu/theme';
import React from 'react';
import { StyleSheet } from 'react-native';
import { BorderlessButton } from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import { IconButtonProps } from './IconButton.interfaces';

const IconButton: React.FC<IconButtonProps> = (props) => {
  const { color, name, compact, ...rest } = props;
  const theme = useTheme();
  const rippleColor = React.useMemo(() => {
    if (color == null) return undefined;
    if (color in theme.palette)
      return theme.palette[color as ButtonColors][theme.mode ?? 'light'];
  }, [color, theme]);
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
      width={borderlessButtonStyle.width}
      height={borderlessButtonStyle.height}
      border-radius={10000}
    >
      <BorderlessButton
        style={borderlessButtonStyle}
        rippleColor={rippleColor}
        {...rest}
      >
        <Icon name={name} variant="icon-button" color={color} />
      </BorderlessButton>
    </Box>
  );
};

export default IconButton;
