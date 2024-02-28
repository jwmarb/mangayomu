import React from 'react';

export interface BoldFontProps extends React.PropsWithChildren {
  isBold: boolean;
  onToggleBold: () => void;
}
