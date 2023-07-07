import Badge from './Badge';
export default Badge;
import { Colors } from '@mangayomu/theme';
import React from 'react';

export enum BadgeLocation {
  TOP_LEFT,
  BOTTOM_LEFT,
  TOP_RIGHT,
  BOTTOM_RIGHT,
}

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
