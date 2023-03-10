import styled, { css } from '@emotion/native';
import React from 'react';
import { IconProps, ImageIconProps } from './Icon.interfaces';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import MaterialCommunityIconNames from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import * as AnimatedPlus from '@components/AnimatedPlus';
import { getOrUseCustomColor } from '@components/Text';

type RequireKey<T, KEYS extends keyof T> = Omit<T, KEYS> & {
  [K in keyof T as K extends KEYS ? K : never]-?: T[K];
};

const styles = ScaledSheet.create({
  imageIcon: {
    borderRadius: '4@ms',
  },
});

const Icon: React.FC<IconProps | ImageIconProps> = (props) => {
  if (props.name == null) throw Error('name is required in Icon');
  if (props.type === 'font' && props.name in MaterialCommunityIconNames)
    return (
      <IconFromFont
        as={props.animated ? AnimatedPlus.Icon : undefined}
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        {...(props as unknown as any)}
      />
    );
  const { size = moderateScale(32) } = props;
  return (
    <FastImage
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
