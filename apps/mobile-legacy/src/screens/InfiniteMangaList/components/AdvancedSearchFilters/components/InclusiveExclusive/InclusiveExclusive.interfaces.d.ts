import { FilterState } from '@redux/slices/mainSourceSelector';

export interface InclusiveExclusiveProps {
  onToggleInclusiveExclusive?: (key: string, value: string) => void;
  itemKey: string;
  fieldKey: string;
  title: string;
  state: FilterState;
}
