import { ActivityIndicator, ListRenderItem, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { FetchedMangaResults } from '@/stores/explore';
import Text from '@/components/primitives/Text';
import Manga from '@/components/composites/Manga';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import useTheme from '@/hooks/useTheme';

const styles = createStyles((theme) => ({
  container: {
    gap: theme.style.size.m,
  },
  title: {
    flexDirection: 'row',
    gap: theme.style.size.m,
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    alignItems: 'center',
  },
}));

type MangaListProps = {
  data?: FetchedMangaResults['latest'] | FetchedMangaResults['trending'];
  title: string;
  isFetching: boolean;
};

const renderItem: ListRenderItem<unknown> = ({ item }) => (
  <Manga manga={item} />
);
const keyExtractor = (item: unknown, index: number) => index.toString();

function ListEmptyComponent() {
  return (
    <>
      {new Array(10).fill(0).map((x, i) => (
        <Manga.Skeleton key={i} />
      ))}
    </>
  );
}

export default function MangaList(props: MangaListProps) {
  const contrast = useContrast();
  const theme = useTheme();
  const style = useStyles(styles, contrast);
  return (
    <View style={style.container}>
      <View style={style.title}>
        {props.isFetching && (
          <ActivityIndicator color={theme.palette.primary.main} />
        )}
        <Text variant="h4">{props.title}</Text>
      </View>
      <FlatList
        ListEmptyComponent={ListEmptyComponent}
        data={props.data != null ? props.data.mangas.slice(0, 10) : []}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        horizontal
      />
    </View>
  );
}
