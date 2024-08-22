import { View } from 'react-native';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/screens/MangaView/styles';
import Chapter from '@/screens/MangaView/components/primitives/Chapter';
import {
  useMangaViewChapters,
  useMangaViewData,
} from '@/screens/MangaView/context';

export default function ListFooterComponent() {
  const meta = useMangaViewData();
  const chapters = useMangaViewChapters();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  if (
    meta != null &&
    chapters != null &&
    chapters.length < meta.chapters.length
  ) {
    return (
      <View style={style.contentContainerStyle}>
        <Chapter.Skeleton />
        <Chapter.Skeleton />
        <Chapter.Skeleton />
        <Chapter.Skeleton />
        <Chapter.Skeleton />
        <Chapter.Skeleton />
        <Chapter.Skeleton />
        <Chapter.Skeleton />
      </View>
    );
  }

  return <View style={style.contentContainerStyle} />;
}
