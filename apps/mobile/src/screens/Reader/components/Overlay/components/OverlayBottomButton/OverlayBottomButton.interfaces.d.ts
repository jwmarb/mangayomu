import { IconProps } from '@components/Icon/Icon.interfaces';
import React from 'react';

export interface OverlayBottomButtonProps extends React.PropsWithChildren {
  name: IconProps['name'];
}
