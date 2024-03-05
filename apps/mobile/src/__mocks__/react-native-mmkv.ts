// Mocks all used `react-native-mmkv` modules that use native implementation
import React from 'react';
import type { useMMKVBoolean as originalUseMMKVBoolean } from 'react-native-mmkv';

export class MMKV {
  private static mmkvInstances: Set<MMKV> = new Set();
  private data: Map<string, unknown>;
  private listeners: Set<(key: string) => void>;
  constructor() {
    this.data = new Map();
    this.listeners = new Set();
    MMKV.mmkvInstances.add(this);
  }
  public static resetMockInstances() {
    for (const instance of this.mmkvInstances) {
      instance.clearAll();
    }
  }
  set(key: string, value: string | number | boolean | Uint8Array): void {
    this.data.set(key, value);
    for (const listener of this.listeners) {
      listener(key);
    }
  }
  getBoolean(key: string): boolean | undefined {
    const value = this.data.get(key);
    if (value !== undefined && typeof value !== 'boolean')
      throw new Error(
        `Called "getBoolean" on key "${key}" but it returned ${typeof value}`,
      );

    return value;
  }
  getString(key: string): string | undefined {
    const value = this.data.get(key);
    if (value !== undefined && typeof value !== 'string')
      throw new Error(
        `Called "getString" on key "${key}" but it returned ${typeof value}`,
      );

    return value;
  }
  getNumber(key: string): number | undefined {
    const value = this.data.get(key);
    if (value !== undefined && typeof value !== 'number')
      throw new Error(
        `Called "getBoolean" on key "${key}" but it returned ${typeof value}`,
      );

    return value;
  }
  getBuffer(key: string): Uint8Array | undefined {
    const value = this.data.get(key);
    if (value !== undefined && value instanceof Uint8Array === false)
      throw new Error(
        `Called "getValue" on key "${key}" but it returned ${typeof value}`,
      );

    return value;
  }
  contains(key: string): boolean {
    return this.data.has(key);
  }
  delete(key: string): void {
    this.data.delete(key);
  }
  getAllKeys(): string[] {
    return Array.from(this.data.keys());
  }
  clearAll(): void {
    this.data.clear();
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  recrypt(key: string | undefined): void {
    // do nothing
  }
  toString(): string {
    return String(this.data);
  }
  toJSON(): object {
    const obj: Record<string, unknown> = {};
    for (const [key, value] of this.data.entries()) {
      obj[key] = value;
    }
    return obj;
  }
  addOnValueChangedListener(onValueChanged: (key: string) => void) {
    this.listeners.add(onValueChanged);
    return {
      remove: () => {
        this.listeners.delete(onValueChanged);
      },
    };
  }
}

export function useMMKVBoolean(
  key: string,
  mmkv: MMKV,
): ReturnType<typeof originalUseMMKVBoolean> {
  const [value, _setValue] = React.useState(() => mmkv.getBoolean(key));
  const setValue: ReturnType<typeof originalUseMMKVBoolean>[1] =
    React.useCallback((newState) => {
      if (typeof newState === 'function')
        _setValue((curr) => {
          if (curr != null) mmkv.set(key, curr);
          else mmkv.delete(key);
          return newState(curr);
        });
      else {
        if (newState != null) mmkv.set(key, newState);
        else mmkv.delete(key);
        _setValue(newState);
      }
    }, []);
  return [value, setValue];
}

afterEach(() => {
  // Reset each instance so that previous states do not get passed into tests
  MMKV.resetMockInstances();
});
