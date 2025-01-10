import Icon from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import Screen from '@/components/primitives/Screen';
import useBoolean from '@/hooks/useBoolean';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { HistoryEntry } from '@/models/HistoryEntry';
import { Table } from '@/models/schema';
import { HISTORY_ENTRY_HEIGHT } from '@/screens/Home/tabs/History/components/composites';
import Entry from '@/screens/Home/tabs/History/components/composites/Entry';
import { Q } from '@nozbe/watermelondb';
import { useDatabase } from '@nozbe/watermelondb/react';
import React from 'react';
import { ListRenderItem } from 'react-native';

const renderItem: ListRenderItem<HistoryEntry> = ({ item }) => (
  <Entry entry={item} />
);
const keyExtractor = (entry: HistoryEntry) => entry.id;

const getItemLayout = (
  _: ArrayLike<HistoryEntry> | null | undefined,
  index: number,
) => ({
  index,
  offset: index * HISTORY_ENTRY_HEIGHT,
  length: HISTORY_ENTRY_HEIGHT,
});

export default function History() {
  const [entries, setEntries] = React.useState<HistoryEntry[]>([]);
  const [loading, toggleLoading] = useBoolean(true);

  const database = useDatabase();
  const collapsible = useCollapsibleHeader({
    title: 'History',
    // headerRight: (
    //   <IconButton
    //     icon={<Icon type="icon" name="magnify" />}
    //     onPress={() => {
    //       console.log('clearing database');
    //       database
    //         .write(async () => {
    //           await database
    //             .get<HistoryEntry>(Table.HISTORY_ENTRIES)
    //             .query()
    //             .markAllAsDeleted();
    //         })
    //         .then(() => {
    //           console.log('cleared database');
    //         });
    //     }}
    //   />
    // ),
  });

  React.useEffect(() => {
    const historyEntries = database.get<HistoryEntry>(Table.HISTORY_ENTRIES);
    async function init() {
      const observer = historyEntries
        .query(Q.sortBy('updated_at', Q.desc))
        .observe();
      const subscription = observer.subscribe((changes) => {
        setEntries(changes);
        toggleLoading(false);
      });
      return () => {
        subscription.unsubscribe();
      };
    }
    init();
  }, []);

  return (
    <Screen.FlatList
      removeClippedSubviews
      windowSize={9}
      maxToRenderPerBatch={9}
      updateCellsBatchingPeriod={20}
      getItemLayout={getItemLayout}
      collapsible={collapsible}
      data={entries}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
}
