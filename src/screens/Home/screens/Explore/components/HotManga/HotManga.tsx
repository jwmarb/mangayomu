import { Button, Category, Icon, Placeholder, Progress, Spacer, Typography } from '@components/core';
import Flex from '@components/Flex';
import useAPICall from '@hooks/useAPICall';
import { useRootNavigation } from '@navigators/Root';
import { keyExtractor, renderItem } from '@screens/Home/screens/Explore/components/HotManga/HotManga.flatlist';
import useMangaSource from '@hooks/useMangaSource';
import React from 'react';
import { RefreshableComponent } from '@screens/Home/screens/Explore/Explore.interfaces';

const HotManga: React.ForwardRefRenderFunction<RefreshableComponent, {}> = (props, ref) => {
  const {} = props;
  const source = useMangaSource();
  const {
    state: [mangas, setMangas],
    loading,
    error,
    refresh,
  } = useAPICall(() => source.listHotMangas());

  const navigation = useRootNavigation();

  function handleOnPress() {
    if (mangas) {
      navigation.navigate('GenericMangaList', { mangas, type: 'Trending' });
    }
  }

  React.useImperativeHandle(ref, () => ({
    refresh,
  }));

  return (
    <Flex direction='column'>
      <Category.Header>
        <Typography variant='subheader'>
          Trending updates <Icon bundle='MaterialCommunityIcons' name='fire' color='secondary' />
        </Typography>
        <Button
          title={loading ? '' : 'View All'}
          onPress={handleOnPress}
          icon={loading && <Progress />}
          disabled={loading}
        />
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

export default React.memo(React.forwardRef(HotManga));
