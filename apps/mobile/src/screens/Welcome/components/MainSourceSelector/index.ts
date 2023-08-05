import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React from 'react';
import { register } from 'react-native-bundle-splitter';

export default register({
  loader: () => import('./MainSourceSelector'),
}) as unknown as React.ForwardRefExoticComponent<
  React.RefAttributes<BottomSheetMethods>
>;
