import DotBadge from '@components/Badge/Badge.dot';
import ImageBadge from '@components/Badge/Badge.image';
import NumberBadge from '@components/Badge/Badge.number';
import React from 'react';
import { BadgeProps } from './';

const Badge: React.FC<BadgeProps> = (props) => {
  switch (props.type) {
    case 'dot':
      return <DotBadge {...props} />;
    case 'number':
      return <NumberBadge {...props} />;
    case 'image':
      return <ImageBadge {...props} />;
    case 'status':
    default:
      return null;
  }
};

export default Badge;
