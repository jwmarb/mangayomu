import React from 'react';
import Skeleton from './Skeleton';
export default Skeleton;

export interface SkeletonProps extends React.PropsWithChildren {
  fullWidth?: boolean;
  height?: string | number;
}
