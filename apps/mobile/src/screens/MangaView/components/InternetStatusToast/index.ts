import InternetStatusToast from './InternetStatusToast';
import { useManga } from '@database/schemas/Manga';
import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface InternetStatusToastProps extends React.PropsWithChildren {
  manga?: ReturnType<typeof useManga>['manga'];
  networkStatusOffset: SharedValue<number>;
  fetchError: string;
}
export default InternetStatusToast;
