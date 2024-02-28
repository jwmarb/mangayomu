import MultiCheckbox from './MultiCheckbox';
export default MultiCheckbox;
export interface MultiCheckboxProps {
  state?: number;
  onChange?: (newVal: number) => void;
  defaultState?: number;
}
