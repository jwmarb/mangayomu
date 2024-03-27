import { ActivityIndicator, View } from 'react-native';
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

const { ListEmptyComponent, getItemLayout, keyExtractor, renderItem } =
  Manga.generateFlatListProps({ horizontal: true });

export default function MangaList(props: MangaListProps) {
  const contrast = useContrast();
  const theme = useTheme();
  const style = useStyles(styles, contrast);
  const data = props.data != null ? props.data.mangas.slice(0, 10) : [];
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
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}
