import { TYPE_MAPPING, type t } from './jstypes';
import { AssertionResult } from './types';

export class List<T> {
  private array: readonly T[];
  public constructor(values: readonly T[]) {
    this.array = values;
  }
  public toArray() {
    return this.array;
  }
}

export class Union<T> {
  private array: readonly T[];
  public constructor(values: readonly T[]) {
    this.array = values;
  }
  public toArray() {
    return this.array;
  }
}

export function list<T>(values: readonly T[]) {
  return new List<T>(values);
}

export function union<T>(values: readonly T[]) {
  return new Union<T>(values);
}

export function isUnion(value: unknown): value is Union<unknown> {
  return value instanceof Union;
}

export function isList(value: unknown): value is List<unknown> {
  return value instanceof List;
}

export function stringify(value: unknown): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) {
    return '[' + value.map((x) => stringify(x)).join(', ') + ']';
  }
  const x = JSON.stringify(value);
  if (typeof x === 'string' && x.length > 203)
    return (
      x.substring(0, 200) + ' ... ' + x.substring(x.length - 200, x.length)
    );
  return x;
}

export function typeToString<T>(
  type: JSType<T>,
  builder = {} as Record<string, string>,
): string {
  if (isUnion(type)) {
    const union = (type as Union<JSType<T>>).toArray();
    return `(${union.map((x) => typeToString(x)).join(' | ')})`;
  }
  if (isList(type)) {
    const list = (type as List<JSType<T>>).toArray();
    if (list.length > 1)
      return `(${list.map((x) => typeToString(x)).join(' | ')})[]`;
    return `${typeToString(list[0])}[]`;
  }

  if (type != null && typeof type === 'object') {
    for (const key in type) {
      builder[key] = typeToString(type[key] as any);
    }
    return stringify(builder);
  }

  if (typeof type === 'function') return type.name;

  const stype = String(type);
  if (stype in TYPE_MAPPING)
    return TYPE_MAPPING[stype as keyof typeof TYPE_MAPPING];

  return stype;
}

export type JSType<T> = IsUnion<T> extends true
  ? Union<ObjectJSTypes<T>>
  : T extends (infer U)[]
  ? List<ObjectJSTypes<U>>
  : T extends Record<string, unknown>
  ? {
      [K in keyof T]-?: JSType<T[K]>;
    }
  : unknown extends T
  ? t.any
  : string extends T
  ? t.string
  : number extends T
  ? t.number
  : T extends boolean
  ? t.boolean
  : T extends undefined
  ? t.undefined
  : T extends null
  ? t.null
  : IsClass<T> extends true
  ? Class<T>
  : T;

type IsUnion<T> = (
  [T, never] extends [infer U, never]
    ? U extends unknown
      ? [T, keyof U] extends [U | boolean, keyof T]
        ? false
        : true
      : never
    : never
) extends false
  ? false
  : true;

type ObjectJSTypes<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T]-?: T[K] extends Record<string, unknown>
        ? ObjectJSTypes<T[K]>
        : JSType<T[K]>;
    }
  : JSType<T>;

type IsClass<T> = T extends object
  ? T extends Record<string, unknown>
    ? false
    : true
  : false;
export type Class<T> = new (...args: any[]) => T;

export const PASS: AssertionResult = { pass: true, message: () => '' };
