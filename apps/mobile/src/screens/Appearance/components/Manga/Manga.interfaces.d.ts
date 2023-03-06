import { SettingsState } from '@redux/slices/settings';
import React from 'react';

export interface MangaProps extends React.PropsWithChildren {
  book: SettingsState['book'];
}
