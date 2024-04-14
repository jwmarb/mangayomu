import React from 'react';
import { InvalidUseContextException } from '@/exceptions/InvalidUseContextException';
import { ExploreErrorsContext } from '@/screens/Home/tabs/Explore/context';

export default function useExploreErrors() {
  const ctx = React.useContext(ExploreErrorsContext);
  if (ctx == null) {
    throw new InvalidUseContextException(ExploreErrorsContext);
  }
  return ctx;
}
