import { ModalBuilderProps } from '@components/ModalBuilder/ModalBuilder.interfaces';
import React from 'react';

export interface ModalMenuProps<T> extends ModalBuilderProps {
  value: T;
  onChange: (newValue: T) => void;
  enum: Record<string | number, T>;
}
