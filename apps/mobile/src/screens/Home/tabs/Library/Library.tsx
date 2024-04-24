import { Q, Query } from '@nozbe/watermelondb';
import { useDatabase, withObservables } from '@nozbe/watermelondb/react';
import React from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Freeze } from 'react-freeze';
import { ListRenderItem } from 'react-native';
import { Manga as MManga, MangaSource } from '@mangayomu/mangascraper';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { HomeStackProps } from '@/screens/Home/Home';
import { MANGA_ID, Table } from '@/models/schema';
import { Manga } from '@/models/Manga';
import MangaComponent from '@/components/composites/Manga';
import { LocalManga } from '@/models/LocalManga';

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
  const columns = useColumns();
  const isFocused = useIsFocused();
  const collapsible = useCollapsibleHeader({
    title: 'Library',
  });
  React.useEffect(() => {
    async function initialize() {
      const mangas = database
        .get<Manga>(Table.MANGAS)
        .query(Q.where('is_in_library', 1));
      const query = database
        .get<LocalManga>(Table.LOCAL_MANGAS)
        .query(
          Q.unsafeSqlQuery(
            `SELECT localMangas.* from ${Table.LOCAL_MANGAS} localMangas where localMangas.link in (select manga.link from ${Table.MANGAS} manga where manga.is_in_library = 1)`,
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
  }, []);

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
