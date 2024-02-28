import { useLocalRealm, useRealm } from '@database/main';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import { MangaSchema } from '@database/schemas/Manga';
import { ILocalManga, IMangaSchema } from '@mangayomu/schemas';
import { useUser } from '@realm/react';
import React from 'react';
import Realm from 'realm';

export type CombinedMangaWithLocal = IMangaSchema & Omit<ILocalManga, '_id'>;

export type CombinedMangaWithLocalUpdater = (
  fn: (obj: Omit<CombinedMangaWithLocal, 'update'>) => void,
) => void;

export default function useCombinedMangaWithLocal<T extends boolean>(
  mangaId: string,
  shouldInitializeManga?: T,
): T extends true ? CombinedMangaWithLocal : CombinedMangaWithLocal | null {
  const realm = useRealm();
  const user = useUser();
  const localRealm = useLocalRealm();
  const [localManga, setLocalManga] = React.useState<LocalMangaSchema | null>(
    localRealm.objectForPrimaryKey(LocalMangaSchema, mangaId),
  );
  const [manga, setManga] = React.useState<MangaSchema | undefined>(() => {
    let x: MangaSchema | undefined = realm
      .objects(MangaSchema)
      .filtered('link = $0', mangaId)[0];
    if (x == null && localManga != null && shouldInitializeManga) {
      realm.write(() => {
        x = realm.create<MangaSchema>(
          MangaSchema,
          {
            _realmId: user.id,
            link: localManga._id,
            title: localManga.title,
            imageCover: localManga.imageCover,
            source: localManga.source,
          },
          Realm.UpdateMode.Modified,
        );
      });
    }
    return x as MangaSchema | undefined;
  });
  React.useEffect(() => {
    const callback: Realm.CollectionChangeCallback<MangaSchema> = (
      collection,
      mods,
    ) => {
      for (const key in mods) {
        if (key === 'deletions') continue;
        if (mods[key as keyof typeof mods].length > 0) {
          for (const index of mods[key as keyof typeof mods]) {
            if (
              collection[index].link === mangaId &&
              collection[index]._realmId === user.id
            ) {
              setManga(collection[index]);
            }
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
              setLocalManga(collection[index]);
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
  }, [mangaId]);
  const combinedManga: T extends true
    ? CombinedMangaWithLocal
    : CombinedMangaWithLocal | null = React.useMemo(() => {
    if (localManga == null) return null as any;
    const obj = {
      ...(localManga.toJSON() as unknown as ILocalManga),
      ...(manga?.toJSON() as unknown as IMangaSchema),
      link: localManga._id,
    } as CombinedMangaWithLocal;

    return obj;
  }, [localManga, manga, mangaId, user.id]);

  return combinedManga;
}
