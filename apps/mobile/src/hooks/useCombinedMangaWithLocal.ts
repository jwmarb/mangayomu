import { useLocalRealm, useRealm } from '@database/main';
import { ILocalManga, LocalMangaSchema } from '@database/schemas/LocalManga';
import { IMangaSchema, MangaSchema } from '@database/schemas/Manga';
import { useApp, useUser } from '@realm/react';
import { DEFAULT_LANGUAGE } from '@screens/MangaView/MangaView';
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
  shouldInitializeManga?: T,
): T extends true ? CombinedMangaWithLocal : CombinedMangaWithLocal | null {
  const realm = useRealm();
  const user = useUser();
  const localRealm = useLocalRealm();
  const [localManga, setLocalManga] = React.useState<
    LocalMangaSchema | undefined
  >(localRealm.objectForPrimaryKey(LocalMangaSchema, mangaId));
  const [manga, setManga] = React.useState<MangaSchema | undefined>(() => {
    let x: MangaSchema | undefined = realm.objectForPrimaryKey(
      MangaSchema,
      mangaId,
    );
    if (x == null && localManga != null && shouldInitializeManga) {
      realm.write(() => {
        x = realm.create<MangaSchema>(
          MangaSchema,
          {
            _id: mangaId,
            _realmId: user.id,
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
            if (collection[index]._id === mangaId) {
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
    } as CombinedMangaWithLocal;
    obj.update = (fn: (obj: CombinedMangaWithLocal) => void) => {
      const copy = { ...obj };
      fn(copy);
      const changedLocalMangaProperties: (keyof ILocalManga)[] = [];
      const changedMangaProperties: (keyof IMangaSchema)[] = [];
      for (const x in copy) {
        const key = x as keyof typeof copy;
        if (obj[key] !== copy[key]) {
          if (key in localManga)
            changedLocalMangaProperties.push(key as keyof ILocalManga);
          else changedMangaProperties.push(key as keyof IMangaSchema);
        }
      }

      if (changedLocalMangaProperties.length > 0) {
        const overrideLocalProperties = {
          _id: mangaId,
        } as Partial<ILocalManga>;
        for (const x of changedLocalMangaProperties) {
          (overrideLocalProperties as any)[x] = copy[x];
        }

        localRealm.write(() => {
          localRealm.create(
            LocalMangaSchema,
            overrideLocalProperties,
            Realm.UpdateMode.Modified,
          );
        });
      }
      if (changedMangaProperties.length > 0) {
        const overrideProperties = {
          _id: mangaId,
          _realmId: user.id,
          title: obj.title,
          imageCover: obj.imageCover,
          source: obj.source,
        } as Partial<IMangaSchema>;

        for (const x of changedMangaProperties) {
          (overrideProperties as any)[x] = copy[x];
        }

        realm.write(() => {
          const updatedManga = realm.create<MangaSchema>(
            MangaSchema,
            overrideProperties,
            Realm.UpdateMode.Modified,
          );
          const isNotWorthSavingToCloud =
            !updatedManga.inLibrary &&
            updatedManga.readerDirection === 'Use global setting' &&
            updatedManga.readerImageScaling === 'Use global setting' &&
            updatedManga.readerLockOrientation === 'Use global setting' &&
            updatedManga.readerZoomStartPosition === 'Use global setting' &&
            (updatedManga.selectedLanguage === 'Use default language' ||
              updatedManga.selectedLanguage === DEFAULT_LANGUAGE) &&
            (updatedManga.currentlyReadingChapter == null ||
              (updatedManga.currentlyReadingChapter != null &&
                updatedManga.currentlyReadingChapter._id ===
                  localManga.chapters[localManga.chapters.length - 1]));
          if (isNotWorthSavingToCloud) {
            setManga(undefined); // prevents access to invalidated fields
            realm.delete(updatedManga);
          }
        });
      }
    };
    return obj;
  }, [localManga, manga, mangaId, user.id]);

  return combinedManga;
}
