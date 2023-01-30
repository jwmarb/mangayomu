import DotBadge from '@components/Badge/Badge.dot';
import NumberBadge from '@components/Badge/Badge.number';
import React from 'react';
import { BadgeProps } from './Badge.interfaces';

const Badge: React.FC<BadgeProps> = (props) => {
  switch (props.type) {
    case 'dot':
      return <DotBadge {...props} />;
    case 'number':
      return <NumberBadge {...props} />;
    case 'status':
    default:
      return null;
  }
};

export default Badge;
