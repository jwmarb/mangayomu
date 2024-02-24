/* eslint-disable @typescript-eslint/no-explicit-any */
export enum t {
  string = '__string__',
  number = '__number__',
  boolean = '__boolean__',
  object = '__object__',
  bigint = '__bigint__',
  symbol = '__symbol__',
  function = '__function__',
  undefined = '__undefined__',
  null = '__null__',
  any = '__any__',
}

export const JS_TYPES = [
  t.string,
  t.number,
  t.object,
  t.boolean,
  t.bigint,
  t.undefined,
  t.null,
  t.symbol,
  t.function,
] as const;
export const TYPE_MAPPING = {
  [t.string]: 'string',
  [t.number]: 'number',
  [t.object]: 'object',
  [t.boolean]: 'boolean',
  [t.bigint]: 'bigint',
  [t.undefined]: 'undefined',
  [t.symbol]: 'symbol',
  [t.function]: 'function',
  [t.null]: 'null',
};
export type JSTypes = (typeof JS_TYPES)[number];
export const JS_TYPES_SET: Set<JSTypes> = new Set(JS_TYPES);
