import LoadingBar from './LoadingBar';
export default LoadingBar;
import React from 'react';

export interface LoadingBarProps extends React.PropsWithChildren {
  loading: boolean;
}
