import { useLocalRealm, useRealm } from '@database/main';
import { ILocalManga, LocalMangaSchema } from '@database/schemas/LocalManga';
import { IMangaSchema, MangaSchema } from '@database/schemas/Manga';
import { useUser } from '@realm/react';
import React from 'react';
import Realm from 'realm';

export type CombinedMangaWithLocal = IMangaSchema &
  ILocalManga & {
    update: CombinedMangaWithLocalUpdater;
  };

export type CombinedMangaWithLocalUpdater = (
  fn: (obj: Omit<CombinedMangaWithLocal, 'update'>) => void,
) => void;

export default function useCombinedMangaWithLocal<T extends boolean>(
  mangaId: string,
  localMangaInitializer: () => ILocalManga = () => {
    throw new Error(
      'In order to access a local manga, it must be defined first. To define all local mangas, call a method that initializes local mangas, then this hook can be used',
    );
  },
  shouldInitializeManga?: T,
): T extends true ? CombinedMangaWithLocal : CombinedMangaWithLocal | null {
  const realm = useRealm();
  const user = useUser();
  const localRealm = useLocalRealm();
  const [localManga, setLocalManga] = React.useState<ILocalManga | undefined>(
    localRealm.objectForPrimaryKey(LocalMangaSchema, mangaId),
  );
  if (localManga == null) return null as any;
  const [manga, setManga] = React.useState<IMangaSchema | undefined>(() => {
    const x = realm.objectForPrimaryKey(MangaSchema, mangaId);
    if (x == null && shouldInitializeManga) {
      let obj = {} as IMangaSchema;
      realm.write(() => {
        obj = realm.create(MangaSchema, {
          _id: mangaId,
          _realmId: user.id,
          title: localManga.title,
          imageCover: localManga.imageCover,
          source: localManga.source,
        });
      });
      return obj;
    }
    return x?.toJSON() as IMangaSchema | undefined;
  });
  React.useEffect(() => {
    const callback: Realm.ObjectChangeCallback<IMangaSchema> = (change) => {
      setManga(change);
    };
    const localCallback: Realm.ObjectChangeCallback<ILocalManga> = (change) => {
      setLocalManga(change);
    };
    const obj = realm.objectForPrimaryKey(MangaSchema, mangaId);
    const localObj = localRealm.objectForPrimaryKey(LocalMangaSchema, mangaId);
    setLocalManga(localMangaInitializer());
    obj?.addListener(callback);
    localObj?.addListener(localCallback);
    return () => {
      obj?.removeListener(callback);
      localObj?.removeListener(localCallback);
    };
  }, [mangaId]);
  const combinedManga: T extends true
    ? CombinedMangaWithLocal
    : CombinedMangaWithLocal | null = React.useMemo(() => {
    if (localManga == null || manga == null) return null as any;
    const obj = { ...localManga, ...manga } as CombinedMangaWithLocal;
    obj.update = (fn: (obj: CombinedMangaWithLocal) => void) => {
      const deepClonedCombinedManga = structuredClone(obj);
      fn(deepClonedCombinedManga);
      for (const x in deepClonedCombinedManga) {
        const key = x as keyof typeof deepClonedCombinedManga;
        if (deepClonedCombinedManga[key] !== obj[key]) {
          if (manga != null && key in manga)
            realm.write(() => {
              (manga as any)[key] = deepClonedCombinedManga[key];
            });
          else if (localManga != null && key in localManga)
            localRealm.write(() => {
              (localManga as any)[key] = deepClonedCombinedManga[key];
            });
        }
      }
    };
    return obj;
  }, [localManga, manga]);

  return combinedManga;
}
