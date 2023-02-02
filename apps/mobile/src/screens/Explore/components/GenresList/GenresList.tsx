import Box from '@components/Box';
import Icon from '@components/Icon';
import { Stack } from '@components/Stack';
import Tag from '@components/Tag';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import { MangaHost } from '@mangayomu/mangascraper';
import React from 'react';
import { ListRenderItem } from 'react-native';
import {
  BaseButton,
  BorderlessButton,
  FlatList,
  ScrollView,
} from 'react-native-gesture-handler';
import { moderateScale } from 'react-native-size-matters';
import connector, { ConnectedGenresListProps } from './GenresList.redux';
const ItemSeparatorComponent = React.memo(() => <Box m={moderateScale(4)} />);
const GenresList: React.FC<ConnectedGenresListProps> = (props) => {
  const { source } = props;
  const genres = React.useMemo(
    () => source.getGenres(),
    [source.getSourcesLength()],
  );
  const theme = useTheme();
  const scrollViewStyles = React.useMemo(
    () => ({ paddingHorizontal: theme.style.spacing.m }),
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
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      >
        <FlatList
          data={genres}
          contentContainerStyle={scrollViewStyles}
          ItemSeparatorComponent={ItemSeparatorComponent}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          numColumns={Math.ceil(genres.length / 3)}
          key={genres.length}
        />
      </ScrollView>
    </Stack>
  );
};

const renderItem: ListRenderItem<{ genre: string; source: string }> = ({
  item,
}) => (
  <Tag
    icon={
      <Icon
        type="image"
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        name={MangaHost.getAvailableSources().get(item.source)!.getIcon()}
        size={moderateScale(18)}
      />
    }
    label={item.genre}
  />
);
const keyExtractor = (i: { genre: string; source: string }) =>
  i.source + ':' + i.genre;

export default connector(GenresList);
