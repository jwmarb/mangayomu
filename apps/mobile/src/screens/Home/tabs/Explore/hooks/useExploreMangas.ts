import { useQuery } from '@tanstack/react-query';
import { useExploreStore } from '@/stores/explore';

const REFETCH_INTERVAL = 1000 * 60 * 30; // 30 minutes

export default function useExploreMangas() {
  const getMangasFromPinnedSources = useExploreStore(
    (state) => state.getMangasFromPinnedSources,
  );
  const query = useQuery({
    queryKey: ['explore'],
    queryFn: () => getMangasFromPinnedSources(),
    refetchInterval: REFETCH_INTERVAL,
  });
  return query;
}
