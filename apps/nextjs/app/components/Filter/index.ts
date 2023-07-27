import BaseFilter from './filter';
import Sort from './sort';
import Select from './select';

const Filter = BaseFilter as typeof BaseFilter & {
  Sort: typeof Sort;
  Select: typeof Select;
};
Filter.Sort = Sort;
Filter.Select = Select;

export default Filter;
