import { DialogMethods } from '@components/Dialog';
import React from 'react';

export const DialogContext = React.createContext<
  React.RefObject<DialogMethods> | undefined
>(undefined);

export default function useDialog() {
  const ctx = React.useContext(DialogContext);

  return ctx?.current ?? { open: () => void 0 };
}
