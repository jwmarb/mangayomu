import Flex from '@components/Flex';
import Genre from '@components/Genre';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import { AppState } from '@redux/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { FlatList, ListRenderItem } from 'react-native';
import { keyExtractor } from '@screens/Home/screens/Explore/components/Genres/Genres.flatlist';
import { Category } from '@components/core';
import { useMangaSource } from '@services/scraper';
import { MangaHostWithFilters } from '@services/scraper/scraper.filters';
import { WithGenresFilter } from '@services/scraper/scraper.interfaces';

const Genres: React.FC = (props) => {
  const {} = props;
  const source = useMangaSource() as MangaHostWithFilters<WithGenresFilter>;
  const genres = useSelector((state: AppState) => (state.settings.selectedSource as any).genres);

  const renderItem: ListRenderItem<string> = React.useCallback(
    (p) => {
      return <Genre genre={p.item} source={source} />;
    },
    [source]
  );
  return (
    <Flex direction='column'>
      <Category.Header>
        <Typography variant='subheader'>Genres</Typography>
      </Category.Header>
      <Spacer y={1} />
      <Category.FlatList
        spacing={1}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
        data={genres}
        initialNumToRender={7}
        maxToRenderPerBatch={15}
        windowSize={5}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
      />
    </Flex>
  );
};

export default React.memo(Genres);
