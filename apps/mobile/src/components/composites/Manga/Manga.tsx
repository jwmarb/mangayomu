import React from 'react';
import { FlatListProps, Image, ListRenderItem, View } from 'react-native';
import Text from '@/components/primitives/Text';
import useManga from '@/hooks/useManga';
import Pressable from '@/components/primitives/Pressable';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import {
  SourceProvider,
  SourceProviderComponent,
} from '@/components/composites/Manga/source';

export const MANGA_WIDTH = 140;
export const MANGA_HEIGHT = 240;

const COVER_WIDTH = 120;
const COVER_HEIGHT = 180;

const styles = createStyles((theme) => ({
  container: {
    width: MANGA_WIDTH,
    height: MANGA_HEIGHT,
    padding: theme.style.size.m,
    gap: theme.style.size.m,
  },
  skeleton: {
    backgroundColor: theme.palette.skeleton,
  },
  skeletonText: {
    backgroundColor: theme.palette.skeleton,
    width: '100%',
    borderRadius: theme.style.borderRadius,
    height: 14, // to be changed in the future,
  },
  cover: {
    width: COVER_WIDTH,
    height: COVER_HEIGHT,
    borderRadius: theme.style.borderRadius / 4,
    alignSelf: 'center',
  },
}));

type MangaProps = {
  manga: unknown;
};

function Manga(props: MangaProps) {
  const manga = useManga(props.manga);
  const contrast = useContrast();
  const source = manga.imageCover
    ? { uri: manga.imageCover }
    : require('@/assets/no-image-available.png');
  const style = useStyles(styles, contrast);
  return (
    <Pressable style={style.container}>
      <Image source={source} style={style.cover} />
      <Text variant="body2" numberOfLines={2}>
        {manga.title}
      </Text>
    </Pressable>
  );
}

function Skeleton() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  return (
    <View style={style.container}>
      <View style={[style.cover, style.skeleton]} />
      <View style={style.skeletonText} />
      <View style={style.skeletonText} />
    </View>
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
  ListEmptyComponent: JSX.Element;
};

const MemoizedSkeleton = React.memo(Skeleton);
const MemoizedManga = React.memo(Manga) as ReturnType<
  typeof React.memo<typeof Manga>
> & {
  Skeleton: ReturnType<typeof React.memo<typeof Skeleton>>;
  generateFlatListProps: (
    props?: Partial<FlatListProps<unknown>>,
  ) => MangaFlatListPreset;
  SourceProvider: SourceProviderComponent;
};

MemoizedManga.SourceProvider = SourceProvider;
MemoizedManga.Skeleton = MemoizedSkeleton;
MemoizedManga.generateFlatListProps = function (props) {
  return {
    renderItem({ item }) {
      return <MemoizedManga manga={item} />;
    },
    ListEmptyComponent: (
      <>
        {new Array(10).fill(0).map((_, i) => (
          <MemoizedSkeleton key={i} />
        ))}
      </>
    ),
    keyExtractor(_, index) {
      return index.toString();
    },
    getItemLayout(_, index) {
      const length = props?.horizontal ? MANGA_WIDTH : MANGA_HEIGHT;
      return { index, length, offset: length * index };
    },
  };
};

export default MemoizedManga;
