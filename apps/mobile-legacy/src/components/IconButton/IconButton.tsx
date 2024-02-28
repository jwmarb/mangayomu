import Box from '@components/Box';
import React from 'react';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';
import { IconButtonProps } from './';
import Pressable from '@components/Pressable';
import { View } from 'react-native';

const styles = ScaledSheet.create({
  compact: {
    width: '32@ms',
    height: '32@ms',
  },
  normal: {
    width: '48@ms',
    height: '48@ms',
  },
  pressable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignSelf: 'center',
    borderRadius: 100000,
  },
});

const compactPressableStyle = [styles.compact, styles.pressable];
const normalPressableStyle = [styles.normal, styles.pressable];

const compactContainerStyle = [styles.compact, styles.container];
const normalContainerStyle = [styles.normal, styles.container];

const IconButton: React.FC<IconButtonProps> = (props) => {
  const {
    color = 'textSecondary',
    icon,
    compact,
    animated,
    rippleColor,
    ...rest
  } = props;

  const pressableStyle = compact ? compactPressableStyle : normalPressableStyle;
  const containerStyle = compact ? compactContainerStyle : normalContainerStyle;

  return (
    <View style={containerStyle}>
      <Pressable
        borderless
        color={rippleColor}
        style={pressableStyle}
        {...rest}
      >
        {icon &&
          React.cloneElement(icon, { variant: 'icon-button', color, animated })}
      </Pressable>
    </View>
  );
};

export default IconButton;
