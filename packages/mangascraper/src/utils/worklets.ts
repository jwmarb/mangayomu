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
