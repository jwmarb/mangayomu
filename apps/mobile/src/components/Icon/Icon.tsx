import styled, { css } from '@emotion/native';
import React from 'react';
import { IconProps, ImageIconProps } from './';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import MaterialCommunityIconNames from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import Animated from 'react-native-reanimated';
import { getOrUseCustomColor } from '@components/Text';
import { Image } from 'react-native';
import ImprovedImage from '@components/ImprovedImage';

const styles = ScaledSheet.create({
  imageIcon: {
    borderRadius: '4@ms',
  },
});

const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

const Icon: React.FC<IconProps | ImageIconProps> = (props) => {
  if (props.name == null) throw Error('name is required in Icon');
  if (props.type === 'font' && props.name in MaterialCommunityIconNames)
    return (
      <IconFromFont
        as={props.animated ? AnimatedIcon : undefined}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as unknown as any)}
      />
    );
  const { size = moderateScale(32) } = props;
  return (
    <ImprovedImage // ImprovedImage
      source={{ uri: props.name }}
      style={[styles.imageIcon, { width: size, height: size }]}
    />
  );
};

const IconFromFont = styled(MaterialCommunityIcons)<IconProps>`
  ${(props) => {
    const {
      theme,
      color = 'textPrimary',
      bold,
      italic,
      underline,
      variant = 'body',
      size,
    } = props;
    return css`
      ${variant !== 'inherit' && theme.typography[variant]};
      ${variant !== 'inherit' &&
      color !== 'inherit' &&
      `color: ${getOrUseCustomColor(theme, color)}`};
      ${size != null && 'font-size: ' + size + 'px'};
      ${bold && 'font-weight: bold'};
      ${italic && 'font-style: italic'};
      ${underline && 'text-decoration-line: underline'};
    `;
  }}
`;
export default Icon;
