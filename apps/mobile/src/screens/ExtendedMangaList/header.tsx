import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/screens/ExtendedMangaList/styles';
import useExploreErrors from '@/screens/Home/tabs/Explore/hooks/useExploreErrors';
import useExploreFetchStatus from '@/screens/Home/tabs/Explore/hooks/useExploreFetchStatus';

export default function ListHeaderComponent() {
  const errors = useExploreErrors();
  const fetchStatus = useExploreFetchStatus();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  if (errors.length > 0 && fetchStatus === 'idle') {
    return (
      <Text color="warning" style={style.listHeader} alignment="center">
        Some mangas may be missing because some sources threw an error.
      </Text>
    );
  }
  return null;
}
