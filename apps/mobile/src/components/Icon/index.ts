import Icon from './Icon';
export default Icon;
import MaterialCommunityIconNames from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import React from 'react';
import { TextProps } from '@components/Text';

interface AbstractIconProps<T>
  extends React.PropsWithChildren,
    Pick<TextProps, 'color' | 'variant' | 'bold' | 'italic' | 'underline'> {
  type?: T;
}

export interface IconProps extends AbstractIconProps<'font'>, TextProps {
  name?: keyof typeof MaterialCommunityIconNames;
  size?: number;
  animated?: boolean;
}

export interface ImageIconProps extends AbstractIconProps<'image'> {
  name?: string;
  size?: number;
}
