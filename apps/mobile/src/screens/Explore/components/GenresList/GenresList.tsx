import Box from '@components/Box';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import React from 'react';
import { ListRenderItem } from 'react-native';
import {
  BaseButton,
  BorderlessButton,
  FlatList,
  ScrollView,
} from 'react-native-gesture-handler';
import connector, { ConnectedGenresListProps } from './GenresList.redux';
const ItemSeparatorComponent = () => <Box my="s" />;
const GenresList: React.FC<ConnectedGenresListProps> = (props) => {
  const { source } = props;
  const genres = React.useMemo(
    () => source.getGenres(),
    [source.getSourcesLength()],
  );
  const theme = useTheme();
  const scrollViewStyles = React.useMemo(
    () => ({ paddingLeft: theme.style.spacing.m }),
    [],
  );
  return (
    <Stack space="s">
      <Box mx="m">
        <Text variant="header" bold>
          Genres
        </Text>
      </Box>
      <ScrollView
        style={scrollViewStyles}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={genres}
          ItemSeparatorComponent={ItemSeparatorComponent}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={Math.floor(genres.length / 3)}
        />
      </ScrollView>
    </Stack>
  );
};

const renderItem: ListRenderItem<{ genre: string; source: string }> = ({
  item,
}) => (
  <BaseButton>
    <Box>
      <Text variant="button" bold>
        {item.genre}
      </Text>
    </Box>
  </BaseButton>
);
const keyExtractor = (i: { genre: string; source: string }) =>
  i.source + ':' + i.genre;

export default connector(GenresList);
