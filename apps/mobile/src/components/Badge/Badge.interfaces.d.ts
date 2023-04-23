import { BadgeLocation } from '@components/Badge';
import { Colors } from '@mangayomu/theme';
import React from 'react';

interface AbstractBadgeProps<T> extends React.PropsWithChildren {
  type: T;
  color?: Colors;
  show?: boolean;
  placement?: BadgeLocation;
}

export interface NumberBadgeProps extends AbstractBadgeProps<'number'> {
  count?: number;
}

export interface StatusBadgeProps extends AbstractBadgeProps<'status'> {
  status: 'error' | 'alert';
}

export type DotBadgeProps = AbstractBadgeProps<'dot'>;

export type BadgeProps =
  | DotBadgeProps
  | StatusBadgeProps
  | NumberBadgeProps
  | ImageBadgeProps;

export interface ImageBadgeProps extends AbstractBadgeProps<'image'> {
  uri?: string;
}
