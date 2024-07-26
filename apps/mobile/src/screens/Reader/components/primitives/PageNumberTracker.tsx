import Text from '@/components/primitives/Text';
import {
  useCurrentChapterContext,
  useCurrentPage,
  usePageBoundaries,
} from '@/screens/Reader/context';
import useMetrics from '@/screens/Reader/hooks/useMetrics';

export default function PageNumberTracker() {
  const metrics = useMetrics();
  if (metrics == null) {
    return null;
  }

  const { currentPageNumber, totalPageCount } = metrics;

  return (
    <Text variant="body2" color="textSecondary">
      {currentPageNumber}/{totalPageCount}
    </Text>
  );
}
