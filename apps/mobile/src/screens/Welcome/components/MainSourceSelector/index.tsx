import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React from 'react';
const LazyMainSourceSelector = React.lazy(() => import('./MainSourceSelector'));

function MainSourceSelector(
  _: unknown,
  ref: React.ForwardedRef<BottomSheetMethods>,
) {
  return (
    <React.Suspense>
      <LazyMainSourceSelector ref={ref} />
    </React.Suspense>
  );
}

export default React.forwardRef(MainSourceSelector);
