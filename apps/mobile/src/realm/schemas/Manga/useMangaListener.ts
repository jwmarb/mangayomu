import { useRealm } from '@database/main';
import { MangaSchema } from '@database/schemas/Manga';
import React from 'react';

export default function useMangaListener(mangaId: string) {
  const realm = useRealm();
  const [manga, setManga] = React.useState<MangaSchema | undefined>(
    realm.objectForPrimaryKey(MangaSchema, mangaId),
  );
  React.useEffect(() => {
    const callback: Realm.CollectionChangeCallback<MangaSchema> = (
      collection,
      mods,
    ) => {
      for (const key in mods) {
        if (mods[key as keyof typeof mods].length > 0) {
          for (const index of mods[key as keyof typeof mods]) {
            if (collection[index]._id === mangaId) setManga(collection[index]);
          }
        }
      }
    };
    const listener = realm.objects(MangaSchema);
    listener?.addListener(callback);
    return () => {
      listener?.removeListener(callback);
    };
  }, []);

  return manga;
}
