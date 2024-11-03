import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useMetrics from '@/screens/Reader/hooks/useMetrics';
import { createStyles } from '@/utils/theme';

const styles = createStyles((theme) => ({
  text: {
    width: theme.style.size.xxl * 2.2,
  },
}));

export default function PageNumberTracker() {
  const metrics = useMetrics();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  if (metrics == null) {
    return null;
  }

  const { currentPageNumber, totalPageCount } = metrics;

  return (
    <Text
      variant="body2"
      color="textSecondary"
      style={style.text}
      numberOfLines={1}
    >
      {currentPageNumber}/{totalPageCount}
    </Text>
  );
}
