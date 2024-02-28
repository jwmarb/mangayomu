import Checkbox from './Checkbox';
export default Checkbox;
export interface CheckboxProps {
  checked?: boolean;
  onChange?: (newVal: boolean) => void;
  defaultState?: boolean;
}
