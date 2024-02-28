import { useLocalRealm, useRealm } from '@database/main';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import { MangaSchema } from '@database/schemas/Manga';
import { useUser } from '@realm/react';
import React from 'react';
import Realm from 'realm';

export default function useMangaListener(mangaId: string) {
  const realm = useRealm();
  const localRealm = useLocalRealm();
  const user = useUser();
  const [manga, setManga] = React.useState<MangaSchema | undefined>(
    realm.objects(MangaSchema).filtered('link = $0', mangaId)[0],
  );
  const [meta, setMeta] = React.useState<LocalMangaSchema | null>(
    localRealm.objectForPrimaryKey(LocalMangaSchema, mangaId),
  );
  React.useEffect(() => {
    const callback: Realm.CollectionChangeCallback<MangaSchema> = (
      collection,
      mods,
    ) => {
      for (const key in mods) {
        if (mods[key as keyof typeof mods].length > 0) {
          for (const index of mods[key as keyof typeof mods]) {
            if (
              collection[index].link === mangaId &&
              collection[index]._realmId === user.id
            )
              setManga(collection[index]);
          }
        }
      }
    };
    const localCallback: Realm.CollectionChangeCallback<LocalMangaSchema> = (
      collection,
      mods,
    ) => {
      for (const key in mods) {
        if (mods[key as keyof typeof mods].length > 0) {
          for (const index of mods[key as keyof typeof mods]) {
            if (collection[index]._id === mangaId) {
              setMeta(collection[index]);
            }
          }
        }
      }
    };
    const listener = realm.objects(MangaSchema);
    const localMangas = localRealm.objects(LocalMangaSchema);
    localMangas.addListener(localCallback);
    listener?.addListener(callback);
    return () => {
      listener?.removeListener(callback);
      localMangas.removeListener(localCallback);
    };
  }, []);

  return { manga, meta };
}
