import React from 'react';

export interface ModalBuilderProps extends React.PropsWithChildren {
  trigger: React.ReactNode;
  onTrigger?: () => void;
  title: string;
}

export interface ModalBuilderMethods {
  close: () => void;
}
