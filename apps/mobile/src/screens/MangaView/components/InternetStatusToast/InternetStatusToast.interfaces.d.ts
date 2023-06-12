import { IMangaSchema } from '@database/schemas/Manga';
import React from 'react';
import { SharedValue } from 'react-native-reanimated';

export interface InternetStatusToastProps extends React.PropsWithChildren {
  manga?: IMangaSchema;
  networkStatusOffset: SharedValue<number>;
}
