import { SpacerBaseX, SpacerBaseY } from '@components/Spacer/Spacer.base';
import { SpacerProps } from '@components/Spacer/Spacer.interfaces';
import React from 'react';

const Spacer: React.FC<SpacerProps> = (props) => {
  if ('x' in props) {
    const { x } = props;
    return <SpacerBaseX x={x} />;
  } else if ('y' in props) {
    const { y } = props;
    return <SpacerBaseY y={y} />;
  }

  throw Error('A spacing should be provided');
};

export default Spacer;
