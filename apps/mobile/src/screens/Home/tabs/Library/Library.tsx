import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Freeze } from 'react-freeze';
import { ListRenderItem } from 'react-native';
import { MangaSource } from '@mangayomu/mangascraper';
import { useMMKVObject } from 'react-native-mmkv';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { LOCAL_MANGA_ID, Table } from '@/models/schema';
import { Manga } from '@/models/Manga';
import MangaComponent from '@/components/composites/Manga';
import { LocalManga } from '@/models/LocalManga';
import IconButton from '@/components/primitives/IconButton';
import Icon from '@/components/primitives/Icon';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import useBoolean from '@/hooks/useBoolean';
import TextInput from '@/components/primitives/TextInput';
import useUserInput from '@/hooks/useUserInput';
import BottomSheet from '@/components/composites/BottomSheet';
import { styles } from '@/screens/Home/tabs/Library/styles';
import { mmkv } from '@/utils/persist';
import { CodeSplitter } from '@/utils/codeSplit';
import Text from '@/components/primitives/Text';
import LibraryEmpty from '@/screens/Home/tabs/Library/components/composites/LibraryEmpty';
const LibraryFilterMenu = React.lazy(
  () =>
    import('@/screens/Home/tabs/Library/components/filter/LibraryFilterMenu'),
);

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

export default function Library() {
  const database = useDatabase();
  const [mangas, setMangas] = React.useState<LocalManga[]>([]);
  const [showSearch, toggleShowSearch] = useBoolean();
  const { input, setInput } = useUserInput();
  const columns = useColumns();
  const isFocused = useIsFocused();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const bottomSheet = React.useRef<BottomSheet>(null);
  const [isLoading, toggleLoading] = useBoolean(true);
  const [sources, setSources] = React.useState<string[]>([]);
  const [include, setInclude] = React.useState<string[]>([]);
  const [exclude, setExclude] = React.useState<string[]>([]);
  const [mangasPerSource, setMangasPerSource] =
    React.useState<Record<string, number>>();
  const [showSource, setShowSource] = useMMKVObject<Record<string, boolean>>(
    'library',
    mmkv,
  );
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
        <IconButton
          onPress={() => bottomSheet.current?.open()}
          icon={<Icon type="icon" name="filter-menu" />}
        />
      ),
    },
    [showSearch],
  );
  React.useEffect(() => {
    const mangas = database
      .get<Manga>(Table.MANGAS)
      .query(Q.where('is_in_library', 1));
    const query = database.get<LocalManga>(Table.LOCAL_MANGAS).query(
      Q.experimentalJoinTables([Table.GENRES]),
      Q.unsafeSqlQuery(
        `SELECT localMangas.* FROM (SELECT DISTINCT localManga.* FROM (SELECT d.* FROM ${
          Table.LOCAL_MANGAS
        } d WHERE d.id NOT IN (SELECT DISTINCT localManga.id FROM ${
          Table.LOCAL_MANGAS
        } localManga INNER JOIN ${
          Table.GENRES
        } genre ON genre.${LOCAL_MANGA_ID} = localManga.id WHERE genre.name IN (${[
          ...exclude.reduce((prev, curr) => {
            for (const source of sources) {
              const genre =
                MangaSource.getSource(source).READABLE_GENRES_MAP[curr];
              if (genre != null) {
                prev.add(`'${genre}'`);
              }
            }
            return prev;
          }, new Set<string>()),
        ].join(', ')}))) localManga INNER JOIN ${
          Table.GENRES
        } genre ON genre.${LOCAL_MANGA_ID}=localManga.id${
          include.length > 0
            ? ` WHERE genre.name IN (${[
                ...include.reduce((prev, curr) => {
                  for (const source of sources) {
                    const genre =
                      MangaSource.getSource(source).READABLE_GENRES_MAP[curr];
                    if (genre != null) {
                      prev.add(`'${genre}'`);
                    }
                  }
                  return prev;
                }, new Set<string>()),
              ].join(', ')})`
            : ''
        }) localMangas WHERE localMangas.link IN (SELECT manga.link FROM ${
          Table.MANGAS
        } manga WHERE manga.is_in_library = 1) AND localMangas.title like ? AND localMangas.source IN (${sources
          .filter((x) => showSource?.[x] ?? true)
          .map((x) => `'${x}'`)
          .join(', ')})`,
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
  }, [input, showSource, sources, include, exclude]);

  React.useEffect(() => {
    const localMangas = database.get<LocalManga>(Table.LOCAL_MANGAS);
    const mangas = database.get<Manga>(Table.MANGAS);

    const libraryObserver = mangas
      .query()
      .observeWithColumns(['is_in_library']);

    const subscription = libraryObserver.subscribe(async () => {
      const [results, results2] = await Promise.all([
        localMangas.query(
          // If you cant read this, that's okay. This is a query for getting all distinct manga sources in the user's library.
          Q.unsafeSqlQuery(
            `SELECT * FROM (SELECT *, row_number() OVER (PARTITION BY source ORDER BY id) as row_number FROM (SELECT localMangas.* from ${Table.LOCAL_MANGAS} localMangas where localMangas.link in (select manga.link from ${Table.MANGAS} manga where manga.is_in_library = 1))) AS rows WHERE row_number = 1`,
          ),
        ),
        localMangas.query(
          Q.unsafeSqlQuery(
            `SELECT localMangas.* FROM ${Table.LOCAL_MANGAS} localMangas JOIN (SELECT manga.link AS manga_link FROM ${Table.MANGAS} manga WHERE manga.is_in_library = 1) manga_links ON localMangas.link = manga_links.manga_link`,
          ),
        ),
      ]);

      setSources(results.map((x) => x.source));
      setShowSource((stored) =>
        results.reduce(
          (prev, curr) => {
            prev[curr.source] = stored?.[curr.source] ?? true;
            return prev;
          },
          {} as Record<string, boolean>,
        ),
      );

      setMangasPerSource(
        results2.reduce(
          (prev, curr) => {
            if (curr.source in prev === false) {
              prev[curr.source] = 0;
            }
            prev[curr.source]++;
            return prev;
          },
          {} as Record<string, number>,
        ),
      );
      toggleLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleOnCheckSource = React.useCallback(
    (title: string, value: boolean) => {
      setShowSource((prev) => ({ ...prev, [title]: value }));
    },
    [setShowSource],
  );

  return (
    <CodeSplitter isLoading={isLoading}>
      <Freeze freeze={!isFocused}>
        <Screen.FlatList
          key={columns}
          keyExtractor={keyExtractor}
          numColumns={columns}
          collapsible={collapsible}
          data={mangas}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          ListEmptyComponent={
            <LibraryEmpty
              isUsingSearch={input.length > 0}
              hasFiltersApplied={include.length > 0 || exclude.length > 0}
            />
          }
        />
      </Freeze>
      <LibraryFilterMenu
        onFilter={(include, exclude) => {
          setInclude(include);
          setExclude(exclude);
        }}
        showSource={showSource}
        onCheckSource={handleOnCheckSource}
        sources={sources}
        mangasPerSource={mangasPerSource}
        ref={bottomSheet}
      />
    </CodeSplitter>
  );
}
