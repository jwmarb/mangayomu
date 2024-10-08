import Chapter from '@/screens/MangaView/components/primitives/Chapter';
import { useMangaViewFetchStatus } from '@/screens/MangaView/context';

export default function ListEmptyComponent() {
  const status = useMangaViewFetchStatus();
  if (status === 'fetching') {
    return (
      <>
        <Chapter.Skeleton />
        <Chapter.Skeleton />
        <Chapter.Skeleton />
        <Chapter.Skeleton />
        <Chapter.Skeleton />
        <Chapter.Skeleton />
        <Chapter.Skeleton />
        <Chapter.Skeleton />
      </>
    );
  }
  return null;
}
