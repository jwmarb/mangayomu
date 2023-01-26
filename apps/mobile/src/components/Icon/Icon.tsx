import styled, { css } from '@emotion/native';
import React from 'react';
import { IconProps, ImageIconProps } from './Icon.interfaces';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FastImage from 'react-native-fast-image';
import { ScaledSheet } from 'react-native-size-matters';
import MaterialCommunityIconNames from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

type RequireKey<T, KEYS extends keyof T> = Omit<T, KEYS> & {
  [K in keyof T as K extends KEYS ? K : never]-?: T[K];
};

const styles = ScaledSheet.create({
  imageIcon: {
    width: '32@ms',
    height: '32@ms',
    borderRadius: 10000,
  },
});

const Icon: React.FC<IconProps | ImageIconProps> = (props) => {
  if (props.name == null) throw Error('name is required in Icon');
  if (props.name in MaterialCommunityIconNames)
    return <IconFromFont {...(props as RequireKey<IconProps, 'name'>)} />;
  return <FastImage source={{ uri: props.name }} style={styles.imageIcon} />;
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
      ${variant !== 'inherit' && `color: ${theme.helpers.getColor(color)}`};
      ${size != null && 'font-size: ' + size + 'px'};
      ${bold && 'font-weight: bold'};
      ${italic && 'font-style: italic'};
      ${underline && 'text-decoration-line: underline'};
    `;
  }}
`;
export default Icon;
