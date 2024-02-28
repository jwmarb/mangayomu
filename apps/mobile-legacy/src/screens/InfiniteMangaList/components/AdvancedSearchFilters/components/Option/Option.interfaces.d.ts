import { OptionFilter } from '@mangayomu/schema-creator';

export interface OptionProps
  extends Omit<OptionFilter<string>, 'type' | 'default'> {
  onChange?: (key: string, option: string) => void;
  name: string;
  selected: string;
  map?: Record<string, string>;
}
