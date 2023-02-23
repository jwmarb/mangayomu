import { ButtonColors } from '@mangayomu/theme';
import React from 'react';

export interface SwitchProps {
  enabled?: boolean;
  onChange?: (newVal: boolean) => void;
  color?: ButtonColors;
}
