import { Colors } from '@mangayomu/theme';
import React from 'react';

interface AbstractBadgeProps<T> extends React.PropsWithChildren {
  type: T;
  color?: Colors;
  show?: boolean;
}

export interface NumberBadgeProps extends AbstractBadgeProps<'number'> {
  count?: number;
}

export interface StatusBadgeProps extends AbstractBadgeProps<'status'> {
  status: 'error' | 'alert';
}

export type DotBadgeProps = AbstractBadgeProps<'dot'>;

export type BadgeProps = DotBadgeProps | StatusBadgeProps | NumberBadgeProps;
