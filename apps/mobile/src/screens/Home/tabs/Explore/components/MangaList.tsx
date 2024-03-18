import { ListRenderItem } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { FetchedMangaResults } from '@/stores/explore';
import Text from '@/components/primitives/Text';

type MangaListProps = {
  data?: FetchedMangaResults['latest'] | FetchedMangaResults['trending'];
};

const renderItem: ListRenderItem<unknown> = ({ item }) => null;
const keyExtractor = (item: unknown, index: number) => index.toString();

export default function MangaList(props: MangaListProps) {
  if (props.data == null) return <Text>Loading...</Text>;
  return (
    <FlatList
      data={props.data.mangas}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      horizontal
    />
  );
}
