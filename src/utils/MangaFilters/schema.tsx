import { Typography } from '@components/core';

type InclusiveExclusiveFilter<T> = {
  type: 'inclusive/exclusive';
  fields: readonly T[];
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
  FilterModal: React.FC;
  schema: T;
};

function createInclusiveExclusiveFilter<T>(obj: Omit<InclusiveExclusiveFilter<T>, 'type'>) {
  return {
    ...obj,
    type: 'inclusive/exclusive' as const,
    include: [] as readonly T[],
    exclude: [] as readonly T[],
  };
}

function createOptionFilter<T>(obj: Omit<OptionFilter<T>, 'type'>) {
  return {
    ...obj,
    type: 'option' as const,
    value: obj.default as T,
  };
}

type FilterCreators = {
  createInclusiveExclusiveFilter<T>(
    obj: Omit<InclusiveExclusiveFilter<Const<T>>, 'type'>
  ): InclusiveExclusiveFilter<Const<T>> & { include: readonly Const<T>[]; exclude: readonly Const<T>[] };
  createOptionFilter<T>(obj: Omit<OptionFilter<Const<T>>, 'type'>): OptionFilter<Const<T>> & { value: Const<T> };
};

export function createSchema<T>(object: (filterCreators: FilterCreators) => Partial<T>) {
  const p = object({ createInclusiveExclusiveFilter, createOptionFilter });
  const elements: React.FC[] = [];
  for (const [key, value] of Object.entries<any>(p)) {
    switch (value.type) {
      case 'inclusive/exclusive':
        elements.push(() => {
          return <Typography color='primary'>Inclusive/Exclusive: {key}</Typography>;
        });
        break;
      case 'option':
        elements.push(() => {
          return <Typography color='secondary'>Option: {key}</Typography>;
        });
        break;
    }
  }

  return {
    FilterModal: () => (
      <>
        {elements.map((Component, i) => (
          <Component key={i} />
        ))}
      </>
    ),
    schema: p,
  };
}
