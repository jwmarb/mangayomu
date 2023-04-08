import { DialogMethods } from '@components/Dialog/Dialog.interfaces';
import React from 'react';

export const DialogContext = React.createContext<
  React.RefObject<DialogMethods> | undefined
>(undefined);

export default function useDialog() {
  const ctx = React.useContext(DialogContext);
  if (ctx?.current == null)
    throw Error('DialogContext was called outside of provider');
  return ctx.current;
}
