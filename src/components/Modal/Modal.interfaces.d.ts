import React from 'react';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  provider?: React.FC;
}

export interface BackdropPressableProps {
  visible: boolean;
}

export interface StatusBarFillerProps {}

export type GestureContext = {
  translateY: number;
};
