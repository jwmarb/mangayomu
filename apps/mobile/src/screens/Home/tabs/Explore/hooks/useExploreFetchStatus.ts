import React from 'react';
import { InvalidUseContextException } from '@/exceptions/InvalidUseContextException';
import { ExploreFetchStatusContext } from '@/screens/Home/tabs/Explore/context';

export default function useExploreFetchStatus() {
  const ctx = React.useContext(ExploreFetchStatusContext);
  if (ctx == null) {
    throw new InvalidUseContextException(ExploreFetchStatusContext);
  }

  return ctx;
}
