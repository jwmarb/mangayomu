import { Dimensions, View } from 'react-native';
import Text from '@/components/primitives/Text';
import { createStyles } from '@/utils/theme';
import ReadingDirection from '@/screens/ReaderSettings/components/composites/ReadingDirection';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import ReadingOrientation from '@/screens/ReaderSettings/components/composites/ReadingOrientation';
import ImageScaling from '@/screens/ReaderSettings/components/composites/ImageScaling';
import ZoomStartPosition from '@/screens/ReaderSettings/components/composites/ZoomStartPosition';

const styles = createStyles((theme) => ({
  header: {
    paddingHorizontal: theme.style.screen.paddingHorizontal,
  },
}));

export default function GlobalSettings() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  return (
    <>
      <View style={style.header}>
        <Text bold>Global</Text>
        <Text variant="body2" color="textSecondary">
          These are settings that each manga will adopt by default
        </Text>
      </View>
      <ReadingDirection />
      <ReadingOrientation />
      <ImageScaling />
      <ZoomStartPosition />
    </>
  );
}
