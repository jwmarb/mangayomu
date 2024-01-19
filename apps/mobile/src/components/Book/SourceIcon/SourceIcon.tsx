import React from 'react';
import type { SourceIconProps } from './';
import Badge from '@components/Badge';

export default function SourceIcon(
  props: React.PropsWithChildren<SourceIconProps>,
) {
  const { children, iconUri } = props;
  return (
    <Badge type="image" uri={iconUri} show>
      {children}
    </Badge>
  );
}
