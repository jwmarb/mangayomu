import Text from '@/components/primitives/Text';
import { ActualListEmptyComponent } from '@/screens/ExtendedMangaList';
import useExtendedMangaListMangasLength from '@/screens/ExtendedMangaList/hooks/useExtendedMangaListMangasLength';
import useExtendedMangaListUserInput from '@/screens/ExtendedMangaList/hooks/useExtendedMangaListUserInput';
import useExploreFetchStatus from '@/screens/Home/tabs/Explore/hooks/useExploreFetchStatus';

export default function ListEmptyComponent() {
  const fetchStatus = useExploreFetchStatus();
  const numOfMangas = useExtendedMangaListMangasLength();
  const input = useExtendedMangaListUserInput();
  if (fetchStatus === 'paused') {
    return (
      <Text color="textSecondary">
        There is no internet connection available :(
      </Text>
    );
  }

  if (fetchStatus === 'fetching') return <ActualListEmptyComponent />;

  if (fetchStatus === 'idle' && numOfMangas === 0)
    return (
      <Text color="textSecondary">
        No results found for "<Text bold>{input}</Text>"
      </Text>
    );

  return null;
}
