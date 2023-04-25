import { HistorySection, MangaHistory } from '@redux/slices/history';
import React from 'react';
import SectionHeader, {
  MANGA_HISTORY_SECTION_HEADER_HEIGHT,
} from './components/SectionHeader';
import MangaHistoryItem, {
  MANGA_HISTORY_ITEM_HEIGHT,
} from '@screens/History/components/MangaHistoryItem';
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
import { useRealm } from '@database/main';
import { MangaSchema } from '@database/schemas/Manga';
import { FlashList, ListRenderItem } from '@shopify/flash-list';

type HistorySectionFlashListData =
  | { type: 'SECTION'; date: number }
  | { type: 'ROW'; data: MangaHistory; sectionDate: number };

function toFlashListData(sections: HistorySection[]) {
  const newArray: HistorySectionFlashListData[] = [];
  for (let i = sections.length - 1; i >= 0; i--) {
    newArray.push({ type: 'SECTION', date: sections[i].date });
    if (sections[i].data.length > 0)
      for (const data of sections[i].data) {
        newArray.push({ type: 'ROW', data, sectionDate: sections[i].date });
      }
  }

  return newArray;
}

const History: React.FC<ConnectedHistoryProps> = ({
  sections,
  incognito,
  toggleIncognitoMode,
  clearMangaHistory,
}) => {
  const dialog = useDialog();
  const [data, setData] = React.useState<HistorySectionFlashListData[]>(
    toFlashListData(sections),
  );
  const [show, setShow] = useBoolean();
  const [query, setQuery] = React.useState<string>('');
  const realm = useRealm();
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
            onChangeText={setQuery}
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
  useMountedEffect(() => {
    if (query.length > 0) {
      const parsedQuery = query.trim().toLowerCase();
      const timeout = setTimeout(
        () =>
          setData(() => {
            const newArray: HistorySectionFlashListData[] = [];
            for (let i = sections.length - 1; i >= 0; i--) {
              newArray.push({ type: 'SECTION', date: sections[i].date });
              if (sections[i].data.length > 0)
                for (const data of sections[i].data) {
                  const dbManga = realm.objectForPrimaryKey(
                    MangaSchema,
                    data.manga,
                  );
                  if (
                    dbManga != null &&
                    dbManga.title.toLowerCase().includes(parsedQuery)
                  )
                    newArray.push({
                      type: 'ROW',
                      data,
                      sectionDate: sections[i].date,
                    });
                }
            }
            return newArray;
          }),
        300,
      );
      return () => {
        clearTimeout(timeout);
      };
    } else setData(toFlashListData(sections));
  }, [query, sections]);

  if (sections.length === 0)
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
    <FlashList
      onScroll={onScroll}
      data={data}
      ListHeaderComponent={<Box style={scrollViewStyle} />}
      ListFooterComponent={<Box style={contentContainerStyle} />}
      keyExtractor={keyExtractor}
      overrideItemLayout={overrideItemLayout}
      getItemType={getItemType}
      estimatedItemSize={MANGA_HISTORY_ITEM_HEIGHT}
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
      layout.size = MANGA_HISTORY_ITEM_HEIGHT;
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
