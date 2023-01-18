import React from 'react';
import { BoxProps } from './Box.interfaces';

const Box: React.FC<BoxProps> = (props) => {
  const {
    'align-items': alignItems,
    'align-self': alignSelf,
    'background-color': bgColor,
  } = props;

  return null;
};

export default Box;
