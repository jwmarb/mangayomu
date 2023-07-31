import BaseFilter from './filter';
import Sort from './sort';
import Select from './select';
import Checkbox from './checkbox';

const Filter = BaseFilter as typeof BaseFilter & {
  Sort: typeof Sort;
  Select: typeof Select;
  Checkbox: typeof Checkbox;
};
Filter.Sort = Sort;
Filter.Select = Select;
Filter.Checkbox = Checkbox;

export default Filter;
