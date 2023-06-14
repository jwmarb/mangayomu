import { Theme } from '@emotion/react';
import { AppearanceMode } from '@theme/provider';

export interface AppearanceModePreviewProps {
  isSelected: boolean;
  mode: AppearanceMode;
  setMode: (setter: AppearanceModePreview) => void;
  theme: Omit<Theme, 'opposite'>;
}
