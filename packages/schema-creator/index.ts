type InclusiveExclusiveFilter<T> = {
  type: 'inclusive/exclusive';
  fields: readonly T[];
};

type SortFilter<T> = {
  type: 'sort';
  options: readonly T[];
  default: T;
};

type Description = {
  type: 'description';
  description: string;
};

type OptionFilter<T> = {
  type: 'option';
  options: readonly T[];
  default: T;
};

type ConstRecord<T> = {
  [P in keyof T]: T[P] extends string
    ? string extends T[P]
      ? string
      : T[P]
    : T[P] extends number
    ? number extends T[P]
      ? number
      : T[P]
    : T[P] extends boolean
    ? boolean extends T[P]
      ? boolean
      : T[P]
    : ConstRecord<T[P]>;
};

type Const<T> = T extends string ? T : T extends number ? T : T extends boolean ? T : ConstRecord<T>;

export type FilterSchemaObject<T> = {
  schema: Partial<T>;
};

export type MutableSortFilter<T> = SortFilter<Const<T>> & {
  value: Const<T>;
  reversed: boolean;
};

export type MutableInclusiveExclusiveFilter<T> = InclusiveExclusiveFilter<Const<T>> & {
  include: readonly Const<T>[];
  exclude: readonly Const<T>[];
};
export type MutableOptionFilter<T> = OptionFilter<Const<T>> & { value: Const<T> };

type FilterCreators = {
  createInclusiveExclusiveFilter<T>(
    obj: Omit<InclusiveExclusiveFilter<Const<T>>, 'type'>
  ): MutableInclusiveExclusiveFilter<T>;
  createOptionFilter<T>(obj: Omit<OptionFilter<Const<T>>, 'type'>): MutableOptionFilter<T>;
  createSortFilter<T>(obj: Omit<SortFilter<Const<T>>, 'type'>): MutableSortFilter<T>;
  createDescription<T>(str: string): Description;
};

function createSortFilter<T>(obj: Omit<SortFilter<T>, 'type'>) {
  return {
    ...obj,
    type: 'sort' as const,
    value: obj.default as T,
    reversed: false,
  };
}

function createInclusiveExclusiveFilter<T>(obj: Omit<InclusiveExclusiveFilter<T>, 'type'>) {
  return {
    ...obj,
    type: 'inclusive/exclusive' as const,
    include: [] as readonly T[],
    exclude: [] as readonly T[],
  };
}

function createDescription(str: string): Description {
  return {
    type: 'description',
    description: str,
  };
}

function createOptionFilter<T>(obj: Omit<OptionFilter<T>, 'type'>) {
  return {
    ...obj,
    type: 'option' as const,
    value: obj.default as T,
  };
}

export default function createSchema<T>(object: (filterCreators: FilterCreators) => Partial<T>): FilterSchemaObject<T> {
  return {
    schema: object({ createInclusiveExclusiveFilter, createOptionFilter, createSortFilter, createDescription }),
  };
}
