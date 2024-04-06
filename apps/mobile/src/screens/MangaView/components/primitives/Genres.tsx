import { View } from 'react-native';
import Text from '@/components/primitives/Text';
import useMangaViewFetchStatus from '@/screens/MangaView/hooks/useMangaViewFetchStatus';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import Chip from '@/components/primitives/Chip';
import useMangaViewSource from '@/screens/MangaView/hooks/useMangaViewSource';

const styles = createStyles((theme) => ({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.style.size.m,
  },
}));

export type GenresProps = {
  genres?: string[];
};

export default function Genres({ genres }: GenresProps) {
  const status = useMangaViewFetchStatus();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const source = useMangaViewSource();

  if (genres != null) {
    return (
      <View style={style.container}>
        {genres.map((x) => (
          <Chip
            key={x}
            title={source.toReadableGenre(x)}
            color={
              x in source.READABLE_GENRES_MAP === false ? 'error' : undefined
            }
          />
        ))}
      </View>
    );
  }

  if (status === 'pending') {
    return (
      <View style={style.container}>
        <Chip.Skeleton />
        <Chip.Skeleton />
        <Chip.Skeleton />
        <Chip.Skeleton />
        <Chip.Skeleton />
        <Chip.Skeleton />
        <Chip.Skeleton />
        <Chip.Skeleton />
      </View>
    );
  }
  return null;
}
