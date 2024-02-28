import Tag from './Tag';
export default Tag;
import { Colors } from '@mangayomu/theme';
import React from 'react';

interface BaseTagProps {
  label: string;
  icon?: React.ReactElement<unknown>;
  color?: Colors;
}

export type TagProps =
  | BaseTagProps
  | (BaseTagProps & {
      id: string;
      onPress?: (id: string) => void;
    });
