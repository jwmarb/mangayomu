import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Freeze } from 'react-freeze';
import { ListRenderItem } from 'react-native';
import { MangaSource } from '@mangayomu/mangascraper';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { HomeStackProps } from '@/screens/Home/Home';
import { Table } from '@/models/schema';
import { Manga } from '@/models/Manga';
import MangaComponent from '@/components/composites/Manga';
import { LocalManga } from '@/models/LocalManga';
import IconButton from '@/components/primitives/IconButton';
import Icon from '@/components/primitives/Icon';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import useBoolean from '@/hooks/useBoolean';
import TextInput from '@/components/primitives/TextInput';
import useUserInput from '@/hooks/useUserInput';

const styles = createStyles((theme) => ({
  headerRightStyle: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
  },
  headerRightStyleWithTextInput: {
    justifyContent: 'flex-end',
    flexDirection: 'row',
    flexShrink: 1,
    flexGrow: 0,
  },
  headerLeftStyle: {
    maxWidth: '82%',
  },
  headerStyle: {
    gap: theme.style.size.m,
    maxWidth: '100%',
  },
}));

const { getItemLayout, useColumns } = MangaComponent.generateFlatListProps({
  flexibleColumns: true,
});

const renderItem: ListRenderItem<LocalManga> = ({ item }) => {
  const source = MangaSource.getSource(item.source);
  return (
    <MangaComponent source={item.source} manga={source.toMangaMeta(item.raw)} />
  );
};

const keyExtractor = (item: LocalManga) => item.id;

export default function Library(props: HomeStackProps<'Library'>) {
  const database = useDatabase();
  const [mangas, setMangas] = React.useState<LocalManga[]>([]);
  const [showSearch, toggleShowSearch] = useBoolean();
  const { input, setInput } = useUserInput();
  const columns = useColumns();
  const isFocused = useIsFocused();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const collapsible = useCollapsibleHeader(
    {
      title: 'Library',
      headerLeftStyle: style.headerLeftStyle,
      headerLeft: (
        <>
          {!showSearch && (
            <IconButton
              icon={<Icon type="icon" name="magnify" />}
              onPress={() => toggleShowSearch(true)}
            />
          )}
          {showSearch && (
            <TextInput
              placeholder="Seach for a title..."
              onChangeText={setInput}
              defaultValue={input}
              iconButton
              icon={
                <IconButton
                  icon={<Icon type="icon" name="arrow-left" />}
                  onPress={() => toggleShowSearch(false)}
                  size="small"
                />
              }
            />
          )}
        </>
      ),
      headerRightStyle: showSearch
        ? style.headerRightStyleWithTextInput
        : style.headerRightStyle,
      showHeaderCenter: !showSearch,
      headerStyle: style.headerStyle,
      headerRight: (
        <IconButton icon={<Icon type="icon" name="filter-menu" />} />
      ),
    },
    [showSearch],
  );
  React.useEffect(() => {
    async function initialize() {
      const mangas = database
        .get<Manga>(Table.MANGAS)
        .query(Q.where('is_in_library', 1));
      const query = database
        .get<LocalManga>(Table.LOCAL_MANGAS)
        .query(
          Q.unsafeSqlQuery(
            `SELECT localMangas.* from ${Table.LOCAL_MANGAS} localMangas where localMangas.link in (select manga.link from ${Table.MANGAS} manga where manga.is_in_library = 1) and localMangas.title like ?`,
            [`%${input}%`],
          ),
        );

      const observer = mangas.observeWithColumns([
        'is_in_library',
        'new_chapters_count',
      ]);
      const subscription = observer.subscribe(async () => {
        const results = await query.fetch();
        setMangas(results);
      });
      return () => {
        subscription.unsubscribe();
      };
    }
    initialize();
  }, [input]);

  return (
    <Freeze freeze={!isFocused}>
      <Screen.FlatList
        key={columns}
        keyExtractor={keyExtractor}
        numColumns={columns}
        collapsible={collapsible}
        data={mangas}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
      />
    </Freeze>
  );
}
