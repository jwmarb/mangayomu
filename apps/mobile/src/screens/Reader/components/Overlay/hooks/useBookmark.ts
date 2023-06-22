import { IMangaSchema, MangaSchema } from '@database/schemas/Manga';
import React from 'react';

export default function useBookmark(manga: MangaSchema) {
  const [isBookmarked, setIsBookmarked] = React.useState<boolean>(
    manga.inLibrary,
  );

  React.useEffect(() => {
    const callback: Realm.ObjectChangeCallback<IMangaSchema> = (change) => {
      setIsBookmarked(change.inLibrary);
    };
    manga.addListener(callback);
    return () => {
      manga.removeListener(callback);
    };
  }, []);

  return isBookmarked;
}
