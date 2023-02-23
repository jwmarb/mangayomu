import { MangaSchema } from '@database/schemas/Manga';
import React from 'react';
import Realm from 'realm';

export interface FilterProps extends React.PropsWithChildren {
  filtered: Realm.Results<MangaSchema & Realm.Object<unknown, never>>;
}
