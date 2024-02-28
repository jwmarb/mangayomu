export { default } from './NetworkToast';
import useNetworkToast from '@screens/Reader/hooks/useNetworkToast';
import React from 'react';

export interface NetworkToastProps extends React.PropsWithChildren {
  style: ReturnType<typeof useNetworkToast>['topOverlayStyle'];
}
