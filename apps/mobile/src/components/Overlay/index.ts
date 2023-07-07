import Overlay from './Overlay';
export default Overlay;
import React from 'react';

export interface OverlayProps extends React.PropsWithChildren {
  onPress?: () => void;
}
