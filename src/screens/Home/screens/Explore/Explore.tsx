import Flex from '@components/Flex';
import Screen from '@components/Screen';
import { AppState } from '@redux/store';
import Genres from '@screens/Home/screens/Explore/components/Genres';
import HotManga from '@screens/Home/screens/Explore/components/HotManga';
import LatestManga from '@screens/Home/screens/Explore/components/LatestManga';
import { useMangaSource } from '@services/scraper';
import withAnimatedMounting from '@utils/withAnimatedMounting';
import React from 'react';
import { useSelector } from 'react-redux';

const Explore: React.FC = (props) => {
  const source = useMangaSource();
  return (
    <Screen scrollable>
      <Flex direction='column' spacing={2}>
        {source.genres.length > 0 && <Genres />}
        {source.hasHotMangas && <HotManga />}
        {source.hasLatestMangas && <LatestManga />}
      </Flex>
    </Screen>
  );
};

export default withAnimatedMounting(Explore);
