import { TitleAlignment } from '@redux/slices/settings';
import React from 'react';

export interface AlignmentProps extends React.PropsWithChildren {
  alignment: TitleAlignment;
  setTitleAlignment: (val: TitleAlignment) => void;
}
