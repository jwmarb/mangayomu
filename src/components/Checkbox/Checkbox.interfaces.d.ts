export interface CheckboxProps {
  checked?: boolean;
  onChange?: (newVal: boolean) => void;
  onLongPress?: () => void;
  useGestureHandler?: boolean;
}
