import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import {
  useMangaViewFetchStatus,
  useMangaViewSource,
} from '@/screens/MangaView/context';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import Chip from '@/components/primitives/Chip';

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
  const navigation = useNavigation();

  if (genres != null) {
    return (
      <View style={style.container}>
        {genres.map((x) => (
          <Chip
            variant="filled"
            key={x}
            onPress={() => {
              if (x in source.READABLE_GENRES_MAP) {
                navigation.dispatch(
                  StackActions.push('SourceBrowser', {
                    genre: x,
                    source: source.NAME,
                  }),
                );
              }
            }}
            title={source.toReadableGenre(x)}
            color={
              x in source.READABLE_GENRES_MAP === false ? 'error' : undefined
            }
          />
        ))}
      </View>
    );
  }

  if (status === 'fetching') {
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
