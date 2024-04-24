import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import { useIsFocused } from '@react-navigation/native';
import { Freeze } from 'react-freeze';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { HomeStackProps } from '@/screens/Home/Home';
import { Table } from '@/models/schema';
import { Manga } from '@/models/Manga';
import MangaComponent from '@/components/composites/Manga';

const { getItemLayout, renderItem, keyExtractor } =
  MangaComponent.generateFlatListProps({ flexibleColumns: true });

export default function Library(props: HomeStackProps<'Library'>) {
  const database = useDatabase();
  const [mangas, setMangas] = React.useState<Manga[]>([]);
  const isFocused = useIsFocused();
  const collapsible = useCollapsibleHeader({
    title: 'Library',
  });
  React.useEffect(() => {
    async function initialize() {
      const query = database
        .get<Manga>(Table.MANGAS)
        .query(Q.where('is_in_library', 1));

      const observer = query.observeWithColumns([
        'is_in_library',
        'new_chapters_count',
      ]);
      const subscription = observer.subscribe(setMangas);
      return () => {
        subscription.unsubscribe();
      };
    }
    initialize();
  }, []);

  return (
    <Freeze freeze={!isFocused}>
      <Screen.FlatList
        collapsible={collapsible}
        data={[]}
        renderItem={renderItem}
        getItemLayout={getItemLayout}
      />
    </Freeze>
  );
}
