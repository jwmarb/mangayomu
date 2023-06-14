import { TitleAlignment } from '@redux/slices/settings';
import React from 'react';
import { ViewStyle } from 'react-native';

export interface AlignmentProps extends React.PropsWithChildren {
  alignment: TitleAlignment;
  setTitleAlignment: (val: TitleAlignment) => void;
}

export interface TitleAlignmentPreviewProps {
  isSelected: boolean;
  setTitleAlignment: (val: TitleAlignment) => void;
  alignItems: ViewStyle['alignItems'];
  titleAlignment: TitleAlignment;
}
