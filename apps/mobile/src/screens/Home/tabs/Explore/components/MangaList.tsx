import { ActivityIndicator, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { FetchedMangaResults, titleMapping } from '@/stores/explore';
import Text from '@/components/primitives/Text';
import Manga from '@/components/composites/Manga';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import useTheme from '@/hooks/useTheme';
import Button from '@/components/primitives/Button';

const styles = createStyles((theme) => ({
  container: {
    gap: theme.style.size.m,
  },
  title: {
    flexDirection: 'row',
    gap: theme.style.size.m,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: theme.style.size.m,
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
}));

type MangaListProps = {
  data?: FetchedMangaResults['latest'] | FetchedMangaResults['trending'];
  isFetching: boolean;
  type: keyof FetchedMangaResults;
};

const { ListEmptyComponent, getItemLayout, keyExtractor, renderItem } =
  Manga.generateFlatListProps({ horizontal: true });

export default function MangaList(props: MangaListProps) {
  const navigation = useNavigation();
  const contrast = useContrast();
  const theme = useTheme();
  const style = useStyles(styles, contrast);
  const data = props.data != null ? props.data.mangas.slice(0, 10) : [];
  function handleOnPress() {
    navigation.navigate('ExtendedMangaList', { type: props.type });
  }
  return (
    <View style={style.container}>
      <View style={style.titleContainer}>
        <View style={style.title}>
          {props.isFetching && (
            <ActivityIndicator color={theme.palette.primary.main} />
          )}
          <Text variant="h4">{titleMapping[props.type]}</Text>
        </View>
        <Button
          title="Show more"
          disabled={props.data == null}
          onPress={handleOnPress}
        />
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
