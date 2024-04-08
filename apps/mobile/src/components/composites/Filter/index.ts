export { default } from './Filter';
export type SortOptionChange = {
  type: 'sort';
  value: unknown;
  reversed: boolean;
};
export type SelectOptionChange = {
  type: 'select';
  value: unknown;
};

export type InclusiveExclusiveOptionChange = {
  type: 'inclusive/exclusive';
  to: 'include' | 'exclude' | 'none';
  value: unknown;
};

export type OptionChange =
  | SortOptionChange
  | SelectOptionChange
  | InclusiveExclusiveOptionChange;

export type OptionChangeCallback = (option: OptionChange) => void;
