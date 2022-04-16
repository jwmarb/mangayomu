import Flex from '@components/Flex';
import Genre from '@components/Genre';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import { AppState } from '@redux/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { FlatList } from 'react-native';
import { keyExtractor, renderItem } from '@screens/Home/screens/Explore/components/Genres/Genres.flatlist';
import { Category } from '@components/core';

const Genres: React.FC = (props) => {
  const {} = props;
  const genres = useSelector((state: AppState) => state.settings.selectedSource.genres);
  return (
    <Flex direction='column'>
      <Category.Header>
        <Typography variant='subheader'>Genres</Typography>
      </Category.Header>
      <Spacer y={1} />
      <Category.FlatList
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
