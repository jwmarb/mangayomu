import { Colors } from '@mangayomu/theme';
import React from 'react';

export interface TagProps {
  label: string;
  icon?: React.ReactElement<unknown>;
  color?: Colors;
  onPress?: () => void;
}
