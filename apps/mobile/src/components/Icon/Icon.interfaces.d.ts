import MaterialCommunityIconNames from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

import React from 'react';
import { TextProps } from '@components/Text/Text.interfaces';

interface AbstractIconProps<T>
  extends React.PropsWithChildren,
    Pick<TextProps, 'color' | 'variant' | 'bold' | 'italic' | 'underline'> {
  type?: T;
}

export interface IconProps extends AbstractIconProps<'font'> {
  name?: keyof typeof MaterialCommunityIconNames;
  size?: number;
}

export interface ImageIconProps extends AbstractIconProps<'image'> {
  name?: string;
}
