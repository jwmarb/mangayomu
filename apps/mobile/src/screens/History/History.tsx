import React, { useTransition } from 'react';
import SectionHeader, {
  MANGA_HISTORY_SECTION_HEADER_HEIGHT,
} from './components/SectionHeader';
import MangaHistoryItem from '@screens/History/components/MangaHistoryItem';
import connector, { ConnectedHistoryProps } from './History.redux';
import useCollapsibleTabHeader from '@hooks/useCollapsibleTabHeader';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import useMountedEffect from '@hooks/useMountedEffect';
import displayMessage from '@helpers/displayMessage';
import useDialog from '@hooks/useDialog';
import Box from '@components/Box';
import Text from '@components/Text';
import { moderateScale } from 'react-native-size-matters';
import Stack from '@components/Stack';
import useBoolean from '@hooks/useBoolean';
import Input from '@components/Input';
import { useLocalQuery, useLocalRealm, useRealm } from '@database/main';
import { ListRenderItem } from '@shopify/flash-list';
import {
  HistorySection,
  MangaHistory,
  UserHistorySchema,
} from '@database/schemas/History';
import useUserHistory from '@hooks/useUserHistory';
import { AnimatedFlashList } from '@components/animated';
import { MANGA_LIST_ITEM_HEIGHT } from '@theme/constants';
import { LocalMangaSchema } from '@database/schemas/LocalManga';
import { useFocusEffect } from '@react-navigation/native';
import useMutableObject from '@hooks/useMutableObject';

type HistorySectionFlashListData =
  | { type: 'SECTION'; date: number }
  | {
      type: 'ROW';
      data: MangaHistory;
      sectionDate: number;
    };

function toFlashListData(sections: HistorySection[]) {
  const newArray: HistorySectionFlashListData[] = [];
  for (let i = sections.length - 1; i >= 0; i--) {
    newArray.push({ type: 'SECTION', date: sections[i].date });
    if (sections[i].data.length > 0)
      for (const data of sections[i].data) {
        newArray.push({
          type: 'ROW',
          data,
          sectionDate: sections[i].date,
        });
      }
  }

  return newArray;
}

const History: React.FC<ConnectedHistoryProps> = ({
  incognito,
  toggleIncognitoMode,
}) => {
  const { clearMangaHistory } = useUserHistory({ incognito });
  const dialog = useDialog();
  const realm = useRealm();
  const sections = React.useRef<HistorySection[]>(
    realm.objects(UserHistorySchema)[0]?.history ?? [],
  );
  const [data, setData] = React.useState<HistorySectionFlashListData[]>(
    toFlashListData(sections.current),
  );
  const localRealm = useLocalRealm();
  const [localMangas, setLocalMangas] = React.useState<ExtraData>(
    sections.current.reduce((prev, curr) => {
      for (const history of curr.data) {
        if (history.manga.link in prev === false)
          prev[history.manga.link] = localRealm.objectForPrimaryKey(
            LocalMangaSchema,
            history.manga.link,
          );
      }
      return prev;
    }, {} as ExtraData),
  );
  const [isLoading, setTransition] = useTransition();
  const [show, setShow] = useBoolean();
  const [query, setQuery] = React.useState<string>('');
  const queryRef = useMutableObject(query);

  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleTabHeader({
      headerTitle: 'History',
      headerLeft: (
        <IconButton
          icon={<Icon type="font" name="magnify" />}
          onPress={() => setShow(true)}
          onLongPress={() => {
            displayMessage('History search');
          }}
        />
      ),
      showHeaderLeft: !show,
      showHeaderRight: !show,
      headerCenter: show ? (
        <Box px="m">
          <Input
            expanded
            onChangeText={(e) => {
              const parsedQuery = e.trim().toLowerCase();
              setQuery(e);
              setTransition(() => {
                const newArray: HistorySectionFlashListData[] = [];
                for (let i = sections.current.length - 1; i >= 0; i--) {
                  newArray.push({
                    type: 'SECTION',
                    date: sections.current[i].date,
                  });
                  if (sections.current[i].data.length > 0)
                    for (const data of sections.current[i].data) {
                      if (data.manga.title.toLowerCase().includes(parsedQuery))
                        newArray.push({
                          type: 'ROW',
                          data,
                          sectionDate: sections.current[i].date,
                        });
                    }
                }
                setData(newArray);
              });
            }}
            defaultValue={query}
            placeholder="Search for a title..."
            iconButton={
              <IconButton
                icon={<Icon type="font" name="arrow-left" />}
                onPress={() => setShow(false)}
              />
            }
          />
        </Box>
      ) : undefined,
      headerRight: (
        <>
          <IconButton
            icon={<Icon type="font" name="trash-can-outline" />}
            onPress={() => {
              dialog.open({
                title: 'Clear manga history?',
                message:
                  'This will clear your entire manga history. This action cannot be undone.',
                actions: [
                  { text: 'Cancel' },
                  {
                    text: 'Yes, clear it',
                    type: 'destructive',
                    onPress: () => {
                      clearMangaHistory();
                      displayMessage('History cleared.');
                    },
                  },
                ],
              });
            }}
          />
          <IconButton
            onPress={() => {
              toggleIncognitoMode();
            }}
            icon={
              <Icon
                type="font"
                name={incognito ? 'incognito-circle' : 'incognito-circle-off'}
              />
            }
            color={incognito ? undefined : 'disabled'}
            onLongPress={() => {
              displayMessage('Toggle Incognito');
            }}
          />
        </>
      ),
      dependencies: [incognito, show],
    });

  useMountedEffect(() => {
    if (incognito) displayMessage('Incognito mode on');
    else displayMessage('Incognito mode off');
  }, [incognito]);
  function updateData() {
    if (query.length > 0) {
      const parsedQuery = queryRef.current.trim().toLowerCase();
      const newArray: HistorySectionFlashListData[] = [];
      for (let i = sections.current.length - 1; i >= 0; i--) {
        newArray.push({ type: 'SECTION', date: sections.current[i].date });
        if (sections.current[i].data.length > 0)
          for (const data of sections.current[i].data) {
            if (data.manga.title.toLowerCase().includes(parsedQuery))
              newArray.push({
                type: 'ROW',
                data,
                sectionDate: sections.current[i].date,
              });
          }
      }
      setData(newArray);
    } else setData(toFlashListData(sections.current));
  }
  React.useEffect(() => {
    const callback: Realm.CollectionChangeCallback<
      UserHistorySchema & Realm.Object<unknown, never>
    > = (changes) => {
      sections.current = changes[0]?.history ?? [];
      setLocalMangas(
        sections.current.reduce((prev, curr) => {
          for (const history of curr.data) {
            if (history.manga.link in prev === false)
              prev[history.manga.link] = localRealm.objectForPrimaryKey(
                LocalMangaSchema,
                history.manga.link,
              );
          }
          return prev;
        }, {} as ExtraData),
      );
      updateData();
    };
    const localMangasCallback: Realm.CollectionChangeCallback<
      LocalMangaSchema
    > = (collection, changes) => {
      const newLocalManga: LocalMangaSchema | undefined =
        collection[changes.newModifications[0]];
      if (newLocalManga != null) {
        setLocalMangas((prev) => {
          if (newLocalManga._id in prev)
            return { ...prev, [newLocalManga._id]: newLocalManga };
          return prev;
        });
      }
    };
    const p = realm.objects(UserHistorySchema);
    const listener = localRealm.objects(LocalMangaSchema);
    p.addListener(callback);
    listener.addListener(localMangasCallback);
    return () => {
      p.removeListener(callback);
      listener.removeListener(localMangasCallback);
    };
  }, []);

  if (data.length === 0)
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

  return (
    <AnimatedFlashList
      extraData={localMangas}
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

type ExtraData = Record<string, LocalMangaSchema | undefined>;

const renderItem: ListRenderItem<HistorySectionFlashListData> = ({
  item,
  extraData: _extraData,
}) => {
  const extraData = _extraData as ExtraData;
  switch (item.type) {
    case 'ROW':
      return (
        <MangaHistoryItem
          item={item.data}
          sectionDate={item.sectionDate}
          localManga={extraData[item.data.manga.link]}
        />
      );
    case 'SECTION':
      return <SectionHeader date={item.date} />;
  }
};
const keyExtractor = (item: HistorySectionFlashListData) => {
  switch (item.type) {
    case 'ROW':
      return 'row:' + item.data.date;
    case 'SECTION':
      return 'section:' + item.date;
  }
};

export default connector(History);
