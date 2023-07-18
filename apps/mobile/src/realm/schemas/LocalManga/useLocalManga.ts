import { useLocalRealm } from '@database/main';
import { LocalMangaSchema } from '@database/schemas/LocalManga';

export default function useLocalManga() {
  const localRealm = useLocalRealm();

  const getLocalManga = (mangaId: string) => {
    const localManga = localRealm.objectForPrimaryKey(
      LocalMangaSchema,
      mangaId,
    );
    if (localManga == null)
      throw new Error(
        `Tried accessing key ${mangaId} but it is undefined. Make sure to initialize local mangas first before calling this method`,
      );

    return localManga;
  };

  return { getLocalManga };
}
