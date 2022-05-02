import React from 'react';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  minimumHeight?: number;
  closeThreshold?: number;
  backdrop?: boolean;
}

export interface BackdropPressableProps {
  visible: boolean;
}

export interface StatusBarFillerProps {}

export type GestureContext = {
  translateY: number;
};
