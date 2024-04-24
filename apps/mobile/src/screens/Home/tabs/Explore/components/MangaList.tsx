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
import useExploreFetchStatus from '@/screens/Home/tabs/Explore/hooks/useExploreFetchStatus';
import { ExploreErrorsContext } from '@/screens/Home/tabs/Explore/context';
import useExploreErrors from '@/screens/Home/tabs/Explore/hooks/useExploreErrors';
import IconButton from '@/components/primitives/IconButton';
import Icon from '@/components/primitives/Icon';

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
  paused: {
    paddingHorizontal: theme.style.screen.paddingHorizontal,
  },
  errorContainer: {
    alignItems: 'center',
    gap: theme.style.size.m,
    flexDirection: 'row',
    paddingHorizontal: theme.style.screen.paddingHorizontal,
  },
}));

type MangaListProps = {
  data?: FetchedMangaResults['latest'] | FetchedMangaResults['trending'];
  isFetching: boolean;
  type: keyof FetchedMangaResults;
  onViewErrors: () => void;
};

const {
  ListEmptyComponent: LoadingComponent,
  getItemLayout,
  keyExtractor,
  renderItem,
} = Manga.generateFlatListProps({ horizontal: true });

function ListEmptyComponent() {
  const fetchStatus = useExploreFetchStatus();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const errors = useExploreErrors();

  if (fetchStatus === 'paused') {
    return (
      <Text style={style.paused} color="textSecondary">
        Unable to connect to the internet.
      </Text>
    );
  }

  if (errors.length > 0) {
    return (
      <View style={style.errorContainer}>
        <Text color="error" alignment="center" bold>
          {errors.length} source{errors.length !== 1 ? 's' : ''} failed to fetch
        </Text>
      </View>
    );
  }

  return <LoadingComponent />;
}

export default function MangaList(props: MangaListProps) {
  const navigation = useNavigation();
  const contrast = useContrast();
  const theme = useTheme();
  const style = useStyles(styles, contrast);
  const errors = props.data?.errors ?? [];
  const data = props.data != null ? props.data.mangas.slice(0, 10) : [];
  function handleOnPress() {
    navigation.navigate('ExtendedMangaList', { type: props.type });
  }

  return (
    <ExploreErrorsContext.Provider value={errors}>
      <View style={style.container}>
        <View style={style.titleContainer}>
          <View style={style.title}>
            {props.isFetching && (
              <ActivityIndicator color={theme.palette.primary.main} />
            )}
            {props.data != null && props.data.errors.length > 0 && (
              <IconButton
                onPress={props.onViewErrors}
                icon={<Icon type="icon" name="alert-octagon" />}
                color="secondary"
              />
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
    </ExploreErrorsContext.Provider>
  );
}
