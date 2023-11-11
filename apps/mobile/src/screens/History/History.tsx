import React from 'react';
import SectionHeader, {
  MANGA_HISTORY_SECTION_HEADER_HEIGHT,
} from './components/SectionHeader';
import MangaHistoryItem from '@screens/History/components/MangaHistoryItem';
import useCollapsibleTabHeader from '@hooks/useCollapsibleTabHeader';
import Icon from '@components/Icon';
import useMountedEffect from '@hooks/useMountedEffect';
import displayMessage from '@helpers/displayMessage';
import Box from '@components/Box';
import Text from '@components/Text';
import { moderateScale } from 'react-native-size-matters';
import Stack from '@components/Stack';
import { useLocalRealm, useQuery, useRealm } from '@database/main';
import { ListRenderItem } from '@shopify/flash-list';
import { UserHistorySchema } from '@database/schemas/History';
import { AnimatedFlashList } from '@components/animated';
import { MANGA_LIST_ITEM_HEIGHT } from '@theme/constants';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import { isSameDay } from 'date-fns';
import useMutableObject from '@hooks/useMutableObject';
import useAppSelector from '@hooks/useAppSelector';
import { HistoryMethods } from '@screens/History';

type HistorySectionFlashListData =
  | { type: 'SECTION'; date: number }
  | {
      type: 'ROW';
      item: UserHistorySchema;
    };

function toFlashListData(
  sections: ArrayLike<UserHistorySchema>,
  localRealm: Realm,
  query?: string,
) {
  if (sections.length === 0) return [];
  const parsedQuery = query?.trim().toLowerCase();
  const newArray: HistorySectionFlashListData[] = [];
  function addRow(idx: number) {
    if (
      !parsedQuery ||
      (parsedQuery &&
        localRealm
          .objectForPrimaryKey(LocalMangaSchema, sections[idx].manga)
          ?.title.trim()
          .toLowerCase()
          .includes(parsedQuery))
    )
      newArray.push({ type: 'ROW', item: sections[idx] });
  }

  let i = 0;
  for (let k = i + 1; k < sections.length; k++) {
    if (!isSameDay(sections[k].date, sections[i].date)) {
      newArray.push({ type: 'SECTION', date: sections[i].date });
      for (let j = i; j < k; j++) {
        addRow(j);
      }

      i = k;
    } else if (isSameDay(sections[k].date, sections[sections.length - 1].date))
      break;
  }
  newArray.push({ type: 'SECTION', date: sections[i].date });
  while (i < sections.length) {
    addRow(i);
    i++;
  }

  return newArray.filter((x, i, self) => {
    if (x.type === 'ROW') return true;
    return self[i + 1] != null && self[i + 1].type === 'ROW';
  });
}

const History: React.ForwardRefRenderFunction<
  HistoryMethods,
  { query: string } & ReturnType<typeof useCollapsibleTabHeader>
> = ({ query, onScroll, scrollViewStyle, contentContainerStyle }, ref) => {
  const incognito = useAppSelector((state) => state.settings.history.incognito);
  const localRealm = useLocalRealm();
  const realm = useRealm();
  const userHistory = useQuery(UserHistorySchema, (collection) =>
    collection.sorted('date', true),
  );
  const [data, setData] = React.useState<HistorySectionFlashListData[]>(() =>
    toFlashListData(userHistory, localRealm),
  );
  const queryRef = useMutableObject(query);
  const [_, setTransition] = React.useTransition();

  React.useImperativeHandle(ref, () => ({
    onQuery(e) {
      setTransition(() => {
        setData(toFlashListData(userHistory, localRealm, e));
      });
    },
  }));

  useMountedEffect(() => {
    if (incognito) displayMessage('Incognito mode on');
    else displayMessage('Incognito mode off');
  }, [incognito]);
  function updateData(newData: Realm.Collection<UserHistorySchema>) {
    setData(toFlashListData(newData, localRealm, queryRef.current));
    // if (query.length > 0) {
    //   const parsedQuery = queryRef.current.trim().toLowerCase();
    //   const newArray: HistorySectionFlashListData[] = [];
    //   for (let i = newData.length - 1; i >= 0; i--) {
    //     newArray.push({ type: 'ROW', item: newData[i] });
    //   }
    //   setData(newArray);
    // } else setData(toFlashListData(newData));
  }
  React.useEffect(() => {
    const callback: Realm.CollectionChangeCallback<
      UserHistorySchema & Realm.Object<unknown, never>
    > = (changes) => {
      updateData(changes.sorted('date', true));
    };

    const p = realm.objects(UserHistorySchema);
    p.addListener(callback);
    return () => {
      p.removeListener(callback);
    };
  }, []);

  if (userHistory.length === 0)
    return (
      <Stack
        space="s"
        p="m"
        flex-grow
        align-items="center"
        justify-content="center"
      >
        <Icon
          type="font"
          name="book-clock"
          variant="inherit"
          size={moderateScale(128)}
        />
        <Text variant="header" bold align="center">
          Your history is empty
        </Text>
        <Text color="textSecondary" align="center">
          Mangas you have read will be shown here
        </Text>
      </Stack>
    );

  if (data.length === 0)
    return (
      <Box
        p="m"
        flex-grow
        height="100%"
        justify-content="center"
        align-items="center"
      >
        <Text variant="header">No results found</Text>
        <Text color="textSecondary">
          There are no mangas that match {query}
        </Text>
      </Box>
    );

  return (
    <AnimatedFlashList
      onScroll={onScroll}
      data={data}
      ListHeaderComponent={<Box style={scrollViewStyle} />}
      ListFooterComponent={<Box style={contentContainerStyle} />}
      keyExtractor={keyExtractor}
      overrideItemLayout={overrideItemLayout}
      getItemType={getItemType}
      estimatedItemSize={MANGA_LIST_ITEM_HEIGHT}
      renderItem={renderItem}
    />
  );
};

const getItemType: (
  item: HistorySectionFlashListData,
  index: number,
) => string | number | undefined = (item) => item.type;

const overrideItemLayout: (
  layout: {
    span?: number | undefined;
    size?: number | undefined;
  },
  item: HistorySectionFlashListData,
  index: number,
  maxColumns: number,
) => void = (layout, item) => {
  switch (item.type) {
    case 'ROW':
      layout.size = MANGA_LIST_ITEM_HEIGHT;
      break;
    case 'SECTION':
      layout.size = MANGA_HISTORY_SECTION_HEADER_HEIGHT;
      break;
  }
};

const renderItem: ListRenderItem<HistorySectionFlashListData> = ({
  item,
  extraData: _extraData,
}) => {
  // const extraData = _extraData as ExtraData;
  switch (item.type) {
    case 'ROW':
      return <MangaHistoryItem item={item.item} />;
    case 'SECTION':
      return <SectionHeader date={item.date} />;
  }
};
const keyExtractor = (item: HistorySectionFlashListData) => {
  switch (item.type) {
    case 'ROW':
      return item.item._id.toHexString();
    case 'SECTION':
      return 'section:' + item.date;
  }
};

export default React.forwardRef(History);
