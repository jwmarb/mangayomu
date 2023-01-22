import MaterialCommunityIconNames from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';

import React from 'react';
import { TextProps } from '@components/Text/Text.interfaces';

export interface IconProps
  extends React.PropsWithChildren,
    Pick<TextProps, 'color' | 'variant' | 'bold' | 'italic' | 'underline'> {
  name: keyof typeof MaterialCommunityIconNames;
  size?: number;
}
