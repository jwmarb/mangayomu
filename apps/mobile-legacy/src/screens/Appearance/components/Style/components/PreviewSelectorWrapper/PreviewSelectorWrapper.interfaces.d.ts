import React from 'react';

export interface PreviewSelectorWrapperProps extends React.PropsWithChildren {
  isSelected: boolean;
  background?: 'default' | 'paper';
}
