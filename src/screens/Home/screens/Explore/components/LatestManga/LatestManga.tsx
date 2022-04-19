import { Button, Category, Icon, IconButton, Placeholder, Spacer, Typography } from '@components/core';
import Flex from '@components/Flex';
import MangaSkeleton from '@components/Manga/Manga.skeleton';
import useAPICall from '@hooks/useAPICall';
import { useRootNavigation } from '@navigators/Root';
import { keyExtractor, renderItem } from '@screens/Home/screens/Explore/components/HotManga/HotManga.flatlist';
import { useMangaSource } from '@services/scraper';
import React from 'react';

const HotManga: React.FC = (props) => {
  const {} = props;
  const source = useMangaSource();
  const {
    state: [mangas, setMangas],
    loading,
    error,
    refresh,
  } = useAPICall(() => source.listRecentlyUpdatedManga());

  const navigation = useRootNavigation();

  function handleOnPress() {
    if (mangas) {
      navigation.navigate('GenericMangaList', { mangas });
    }
  }

  return (
    <Flex direction='column'>
      <Category.Header>
        <Typography variant='subheader'>
          Recently updated <Icon bundle='MaterialCommunityIcons' name='update' color='secondary' />
        </Typography>
        <Button title='View All' onPress={handleOnPress} />
      </Category.Header>
      <Spacer y={1} />
      {loading ? (
        <Category.Header>
          <Placeholder.MangaComponent />
        </Category.Header>
      ) : error ? (
        <Typography>{error}</Typography>
      ) : (
        <Category.FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          horizontal
          data={mangas?.slice(0, 10)}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
        />
      )}
    </Flex>
  );
};

export default React.memo(HotManga);
