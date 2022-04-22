export interface ModalProps {
  visible: boolean;
  onClose: () => void;
}

export interface BackdropPressableProps {
  visible: boolean;
}

export interface StatusBarFillerProps {}

export type GestureContext = {
  translateY: number;
};
