import { View } from 'react-native';
import Text from '@/components/primitives/Text';
import { createStyles } from '@/utils/theme';
import ReadingDirection from '@/screens/ReaderSettings/components/composites/ReadingDirection';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import ReadingOrientation from '@/screens/ReaderSettings/components/composites/ReadingOrientation';
import ImageScaling from '@/screens/ReaderSettings/components/composites/ImageScaling';
import ZoomStartPosition from '@/screens/ReaderSettings/components/composites/ZoomStartPosition';
import {
  MangaProvider,
  useForThisSeries,
} from '@/screens/ReaderSettings/context';

const styles = createStyles((theme) => ({
  header: {
    paddingHorizontal: theme.style.screen.paddingHorizontal,
  },
}));

export default function ForThisSeries() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const manga = useForThisSeries();
  return (
    <MangaProvider value={manga}>
      <View style={style.header}>
        <Text bold>For this series</Text>
        <Text variant="body2" color="textSecondary">
          Settings that only apply to{' '}
          <Text variant="body2" italic color="textSecondary">
            {manga.title}
          </Text>
        </Text>
      </View>
      <ReadingDirection />
      <ReadingOrientation />
      <ImageScaling />
      <ZoomStartPosition />
    </MangaProvider>
  );
}
