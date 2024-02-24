/* eslint-disable @typescript-eslint/no-explicit-any */
import { IWorkletNativeApi } from './types';
const lib = 'react-native-worklets-core';
export async function isWorkletSupported() {
  try {
    await import(lib);
    return true;
  } catch (e) {
    return false;
  }
}

export async function useWorklets() {
  try {
    const worklets = await import(lib);
    if (worklets.Worklets) return worklets.Worklets as IWorkletNativeApi;
    return null;
  } catch (e) {
    return null;
  }
}

const worklets = new WeakMap<
  (...params: any) => string,
  (...params: any) => Promise<any>
>();
export async function createWorklet<T extends (...params: any) => string, P>(
  workletFn: T,
  fallbackFn: (...params: Parameters<T>) => P,
): Promise<(...params: Parameters<T>) => Promise<P>> {
  const worklet = worklets.get(workletFn);
  if (worklet == null)
    try {
      const Worklets = await useWorklets();
      if (Worklets != null) {
        const thread = Worklets.createRunInContextFn(workletFn);
        return async (...params: any) => {
          const serialized = await thread(...params);
          return JSON.parse(serialized) as P;
        };
      }
      return (...params) => Promise.resolve(fallbackFn(...params));
    } catch (e) {
      throw Error('Could not create a worklet');
    }
  return async (...params: any) => {
    const serialized = await worklet(...params);
    return JSON.parse(serialized) as P;
  };
}

export type WorkletFn<T extends (...args: any) => any> = (
  ...params: Parameters<T>
) => Promise<ReturnType<T>>;
