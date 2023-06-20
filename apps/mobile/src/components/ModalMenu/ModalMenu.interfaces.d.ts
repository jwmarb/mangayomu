import React from 'react';

export interface ModalMenuProps<T> extends React.PropsWithChildren {
  title: string;
  value: T;
  onChange: (newValue: T) => void;
  trigger: React.ReactNode;
  enum: Record<string | number, T>;
}
