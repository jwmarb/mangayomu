import { MangaSchema } from '@database/schemas/Manga';
import Realm from 'realm';

export interface LibraryFilterMenuProps {
  filtered: Realm.Results<MangaSchema>;
}
