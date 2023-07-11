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
import { useLocalRealm, useQuery, useRealm } from '@database/main';
import { MangaSchema } from '@database/schemas/Manga';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { Manga, MangaChapter } from '@mangayomu/mangascraper/src';
import { ChapterSchema } from '@database/schemas/Chapter';
import {
  HistorySection,
  MangaHistory,
  UserHistorySchema,
} from '@database/schemas/History';
import { useUser } from '@realm/react';
import useUserHistory from '@hooks/useUserHistory';
import { AnimatedFlashList } from '@components/animated';
import { MANGA_LIST_ITEM_HEIGHT } from '@theme/constants';

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
  const [isLoading, setTransition] = useTransition();
  const [show, setShow] = useBoolean();
  const [query, setQuery] = React.useState<string>('');

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
      const parsedQuery = query.trim().toLowerCase();
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
      updateData();
    };
    const p = realm.objects(UserHistorySchema);
    p.addListener(callback);
    return () => {
      p.removeListener(callback);
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

const renderItem: ListRenderItem<HistorySectionFlashListData> = ({ item }) => {
  switch (item.type) {
    case 'ROW':
      return (
        <MangaHistoryItem item={item.data} sectionDate={item.sectionDate} />
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
