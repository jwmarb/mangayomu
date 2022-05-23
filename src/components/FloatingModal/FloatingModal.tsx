import { Portal } from '@gorhom/portal';
import React from 'react';
import { FloatingModalProps } from './FloatingModal.interfaces';

const FloatingModal: React.FC<FloatingModalProps> = (props) => {
  const { visible } = props;
  return <Portal></Portal>;
};

export default FloatingModal;
