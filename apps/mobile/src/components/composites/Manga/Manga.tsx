import React from 'react';
import {
  Dimensions,
  FlatListProps,
  ListRenderItem,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import Animated, { FadeOut } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import Text from '@/components/primitives/Text';
import useManga from '@/hooks/useManga';
import Pressable from '@/components/primitives/Pressable';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import {
  SourceProvider,
  SourceProviderComponent,
} from '@/components/composites/Manga/source';
import {
  listEmptyComponentStyles,
  styles,
} from '@/components/composites/Manga/styles';
import { MANGA_HEIGHT, MANGA_WIDTH } from '@/components/composites/Manga';
import Image from '@/components/primitives/Image';

type MangaProps = {
  manga: unknown;
};

function Manga(props: MangaProps) {
  const navigation = useNavigation();
  const manga = useManga(props.manga);
  const contrast = useContrast();
  const source = manga.imageCover
    ? { uri: manga.imageCover }
    : require('@/assets/no-image-available.png');
  const style = useStyles(styles, contrast);
  function handleOnPress() {
    navigation.navigate('MangaView', { manga });
  }
  return (
    <View style={style.view}>
      <Pressable style={style.container} onPress={handleOnPress}>
        <Image source={source} style={style.cover} />
        <Text variant="body2" numberOfLines={2}>
          {manga.title}
        </Text>
      </Pressable>
    </View>
  );
}

function Skeleton() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  return (
    <Animated.View exiting={FadeOut} style={style.container}>
      <View style={[style.cover, style.skeleton]} />
      <View style={style.skeletonText} />
      <View style={style.skeletonText} />
    </Animated.View>
  );
}

type MangaFlatListPreset = {
  renderItem: ListRenderItem<unknown>;
  getItemLayout: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: ArrayLike<unknown> | null | undefined,
    index: number,
  ) => { length: number; offset: number; index: number };
  keyExtractor: (item: unknown, index: number) => string;
  ListEmptyComponent: () => JSX.Element;
  contentContainerStyle: StyleProp<ViewStyle>;
  useColumns: () => number;
};

const MemoizedSkeleton = React.memo(Skeleton);
const MemoizedManga = React.memo(Manga) as ReturnType<
  typeof React.memo<typeof Manga>
> & {
  Skeleton: ReturnType<typeof React.memo<typeof Skeleton>>;
  generateFlatListProps: (
    props?: Partial<FlatListProps<unknown>> & { flexibleColumns?: boolean },
  ) => MangaFlatListPreset;
  SourceProvider: SourceProviderComponent;
};

function useColumns() {
  const [columns, setColumns] = React.useState<number>(
    Math.floor(Dimensions.get('window').width / MANGA_WIDTH),
  );
  React.useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setColumns(Math.floor(window.width / MANGA_WIDTH));
    });
    return () => {
      subscription.remove();
    };
  });
  return columns;
}

MemoizedManga.SourceProvider = SourceProvider;
MemoizedManga.Skeleton = MemoizedSkeleton;
const renderItem = () => (
  <View style={listEmptyComponentStyles.skeleton}>
    <MemoizedSkeleton />
  </View>
);
MemoizedManga.generateFlatListProps = function (props) {
  return {
    contentContainerStyle: listEmptyComponentStyles.contentContainerStyle,
    renderItem({ item }) {
      return <MemoizedManga manga={item} />;
    },
    // ListEmptyComponent: (
    //   <>
    //     {new Array(10).fill(0).map((_, i) => (
    //       <MemoizedSkeleton key={i} />
    //     ))}
    //   </>
    // ),
    ListEmptyComponent() {
      const numColumns = useColumns();
      const data = new Array(props?.flexibleColumns ? numColumns * 4 : 10).fill(
        0,
      );
      return (
        <FlatList
          numColumns={props?.flexibleColumns ? numColumns : props?.numColumns}
          data={data}
          renderItem={renderItem}
          keyExtractor={this.keyExtractor}
          {...props}
        />
      );
    },
    keyExtractor(_, index) {
      return index.toString();
    },
    getItemLayout(_, index) {
      const length = props?.horizontal ? MANGA_WIDTH : MANGA_HEIGHT;
      return { index, length, offset: length * index };
    },
    useColumns,
  };
};

export default MemoizedManga;
