import Flex from '@components/Flex';
import Screen from '@components/Screen';
import Genres from '@screens/Home/screens/Explore/components/Genres';
import HotManga from '@screens/Home/screens/Explore/components/HotManga';
import LatestManga from '@screens/Home/screens/Explore/components/LatestManga';
import useMangaSource from '@hooks/useMangaSource';
import React from 'react';
import { RefreshControl } from 'react-native';
import Spacer from '@components/Spacer';

const Explore: React.FC = () => {
  const source = useMangaSource();
  const [loading, setLoading] = React.useState<boolean>(false);
  const hotMangaRef = React.useRef<React.ElementRef<typeof HotManga>>(null);
  const latestMangaRef = React.useRef<React.ElementRef<typeof LatestManga>>(null);
  const handleOnRefresh = async () => {
    try {
      setLoading(true);
      await Promise.all([hotMangaRef.current?.refresh(), latestMangaRef.current?.refresh()]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen
      scrollable
      scrollViewProps={{ refreshControl: <RefreshControl refreshing={loading} onRefresh={handleOnRefresh} /> }}>
      <Flex direction='column' spacing={2}>
        {source?.getGenres().length > 0 && <Genres />}
        {source?.hasHotMangas() && <HotManga ref={hotMangaRef} />}
        {source?.hasLatestMangas() && <LatestManga ref={latestMangaRef} />}
        <Spacer y={20} />
      </Flex>
    </Screen>
  );
};

export default Explore;
