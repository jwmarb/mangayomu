import React from 'react';
import { Image, View } from 'react-native';
import Text from '@/components/primitives/Text';
import useManga from '@/hooks/useManga';
import Pressable from '@/components/primitives/Pressable';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';

const WIDTH = 140;
const HEIGHT = 240;

const COVER_WIDTH = 120;
const COVER_HEIGHT = 180;

const styles = createStyles((theme) => ({
  container: {
    width: WIDTH,
    height: HEIGHT,
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

const MemoizedManga = React.memo(Manga) as ReturnType<
  typeof React.memo<typeof Manga>
> & { Skeleton: ReturnType<typeof React.memo<typeof Skeleton>> };

MemoizedManga.Skeleton = React.memo(Skeleton);

export default MemoizedManga;
