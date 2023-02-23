import { MangaSchema } from '@database/schemas/Manga';
import React from 'react';
import Realm from 'realm';

export interface LibraryFilterMenuProps {
  filtered: Realm.Results<MangaSchema & Realm.Object<unknown, never>>;
}
