import { MangaCoverProps } from './MangaCover.interfaces';
import { MangaCover as Cover } from '@components/core';
import React from 'react';

const MangaCover: React.FC<MangaCoverProps> = (props) => {
  const { mangaCoverURI } = props;
  return <Cover uri={mangaCoverURI} />;
};

export default React.memo(MangaCover);
