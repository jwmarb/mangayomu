type GetRequiredProperties<
  T,
  TPropertiesHaveDefault extends GetAllRequiredProperties<T>,
> = keyof {
  [K in keyof T as Extract<T[K], undefined> extends never
    ? Extract<TPropertiesHaveDefault, K> extends never
      ? K
      : never
    : never]: never;
};

type GetAllRequiredProperties<T> = keyof {
  [K in keyof T as Extract<T[K], undefined> extends never ? K : never]: never;
};
