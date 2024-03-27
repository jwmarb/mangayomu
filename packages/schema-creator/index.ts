export type InclusiveExclusiveFilter<T> = {
  type: 'inclusive/exclusive';
  fields: readonly T[];
  /**
   * Will map fields to the keys present. This should be used if a field needs to be displayed differently to the user.
   * @example
   * ```js
   * fields = ["_4_koma", "shounen_ai(bl)"]
   * map = {
   *  _4_koma: "4-Koma",
   *  "shounen_ai(bl)": "Shounen Ai"
   * }
   * ```
   */
  map?: T extends PropertyKey
    ? Record<T | (string & Record<never, never>), string>
    : never;
};

export type SortFilter<T> = {
  type: 'sort';
  options: readonly T[];
  default: T;
};

export type TextProperty =
  | {
      text: string;
      bold?: boolean;
      italic?: boolean;
      color?:
        | 'primary'
        | 'secondary'
        | 'warning'
        | 'error'
        | 'textPrimary'
        | 'textSecondary';
    }
  | string;

export type Description = {
  type: 'description';
  /**
   * 2D array structure of text.
   *
   * Each element in the first level of the array is a new line ["Line 1", "Line 2"]
   *
   * Each element in the second level of the array is within the line [["Line", "1"], "Line 2"]
   *
   * Different attributes can be applied to the text.
   *
   * @example
   * ```jsx
   * [
   *  ["This text is not bolded, but ", { text: "this", bold: true }, " is."],
   *  [{ text: "This whole text is italicized... ", italic: true }, { text: "And this part is just by itself." }]
   * ]
   *
   * // preview in html
   * <p>This text is not bolded, but <strong>this</strong> is.</p>
   * <p><em>This whole text is italicized... </em>And this part is just by itself.</p>
   * ```
   */
  description: (TextProperty[] | TextProperty)[] | TextProperty;
};

export type OptionFilter<T> = {
  type: 'option';
  options: readonly T[];
  default: T;
  /**
   * Will map fields to the keys present. This should be used if a field needs to be displayed differently to the user.
   * @example
   * ```js
   * fields = ["_4_koma", "shounen_ai(bl)"]
   * map = {
   *  _4_koma: "4-Koma",
   *  "shounen_ai(bl)": "Shounen Ai"
   * }
   * ```
   */
  map?: T extends PropertyKey ? Record<T, string> : never;
};

export type AbstractFilters =
  | OptionFilter<string>
  | Description
  | SortFilter<string>
  | InclusiveExclusiveFilter<string>;

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

type Const<T> = T extends string
  ? T
  : T extends number
  ? T
  : T extends boolean
  ? T
  : ConstRecord<T>;

export type FilterSchemaObject<T> = {
  schema: T;
};

export type MutableSortFilter<T> = SortFilter<Const<T>> & {
  value: Const<T>;
  reversed: boolean;
};

export type MutableInclusiveExclusiveFilter<T> = InclusiveExclusiveFilter<
  Const<T>
> & {
  include: readonly Const<T>[];
  exclude: readonly Const<T>[];
};
export type MutableOptionFilter<T> = OptionFilter<Const<T>> & {
  value: Const<T>;
};

/**
 * @deprecated Use `GeneratedFilterSchema` instead
 */
export type MutableAbstractFilter = Record<
  string,
  | MutableSortFilter<string>
  | MutableInclusiveExclusiveFilter<string>
  | MutableOptionFilter<string>
>;

export type GeneratedFilterSchema = Record<string, MutableFilters>;

export type MutableFilters =
  | MutableSortFilter<string>
  | MutableInclusiveExclusiveFilter<string>
  | MutableOptionFilter<string>
  | Description;

export type ImmutableFilters =
  | Description
  | MutableSortFilter<string>
  | MutableInclusiveExclusiveFilter<string>
  | MutableOptionFilter<string>;

type FilterCreators = {
  createInclusiveExclusiveFilter<T>(
    obj: Omit<InclusiveExclusiveFilter<Const<T>>, 'type'>,
  ): MutableInclusiveExclusiveFilter<T>;
  createOptionFilter<T>(
    obj: Omit<OptionFilter<Const<T>>, 'type'>,
  ): MutableOptionFilter<T>;
  createSortFilter<T>(
    obj: Omit<SortFilter<Const<T>>, 'type'>,
  ): MutableSortFilter<T>;
  createDescription(str: Description['description']): Description;
};

function createSortFilter<T>(obj: Omit<SortFilter<T>, 'type'>) {
  return {
    ...obj,
    type: 'sort' as const,
    value: obj.default as T,
    reversed: false,
  };
}

function createInclusiveExclusiveFilter<T>(
  obj: Omit<InclusiveExclusiveFilter<T>, 'type'>,
) {
  return {
    ...obj,
    type: 'inclusive/exclusive' as const,
    include: [] as readonly T[],
    exclude: [] as readonly T[],
  };
}

function createDescription(str: Description['description']): Description {
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

export default function createSchema<T>(
  object: (filterCreators: FilterCreators) => T,
): FilterSchemaObject<T> {
  return {
    schema: object({
      createInclusiveExclusiveFilter,
      createOptionFilter,
      createSortFilter,
      createDescription,
    }),
  };
}
