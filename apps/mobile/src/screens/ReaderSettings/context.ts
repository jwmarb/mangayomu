import { createContext } from '@/utils/context';
import React from 'react';

export const { Provider: SetStateProvider, useContext: useSetState } =
  createContext<(newValue: any) => Promise<void>>();
