import { View } from 'react-native';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import Synopsis from '@/screens/MangaView/components/primitives/Synopsis';
import useMangaViewData from '@/screens/MangaView/hooks/useMangaViewData';
import { styles } from '@/screens/MangaView/styles';
import Genres from '@/screens/MangaView/components/primitives/Genres';
import Overview from '@/screens/MangaView/components/composites/Overview';
import Actions from '@/screens/MangaView/components/composites/Actions';

export default function ListHeaderComponent() {
  const contrast = useContrast();
  const data = useMangaViewData();
  const style = useStyles(styles, contrast);

  return (
    <>
      <Overview />
      <View style={style.metaContainer}>
        <Actions />
        <Synopsis description={data?.description} />
        <Genres genres={data?.genres} />
      </View>
    </>
  );
}
