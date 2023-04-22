import { HistorySection, MangaHistory } from '@redux/slices/history';
import React from 'react';
import {
  SectionList,
  SectionListData,
  SectionListRenderItem,
  useWindowDimensions,
} from 'react-native';
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
import reverseArray from '@helpers/reverseArray';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';

const History: React.FC<ConnectedHistoryProps> = ({
  sections,
  incognito,
  toggleIncognitoMode,
  clearMangaHistory,
}) => {
  const dialog = useDialog();
  const [parsedSections, setParsedSections] = React.useState<HistorySection[]>(
    reverseArray(sections),
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
  React.useEffect(() => {
    if (query.length > 0) {
      const timeout = setTimeout(
        () =>
          setParsedSections(() => {
            const copy: HistorySection[] = [];
            for (let i = sections.length - 1; i >= 0; i--) {
              const mangasCopy: MangaHistory[] = [];
              for (let k = 0; k < sections[i].data.length; k++) {
                const mangaInDatabase = realm.objectForPrimaryKey(
                  MangaSchema,
                  sections[i].data[k].manga,
                );
                if (
                  mangaInDatabase != null &&
                  mangaInDatabase.title
                    .toLowerCase()
                    .includes(query.trim().toLowerCase())
                )
                  mangasCopy.push(sections[i].data[k]);
              }
              copy.push({ data: mangasCopy, date: sections[i].date });
            }
            return copy;
          }),
        300,
      );
      return () => {
        clearTimeout(timeout);
      };
    } else setParsedSections(reverseArray(sections));
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
    <SectionList
      onScroll={onScroll}
      getItemLayout={getItemLayout}
      maxToRenderPerBatch={20}
      initialNumToRender={0}
      windowSize={13}
      contentContainerStyle={contentContainerStyle}
      style={scrollViewStyle}
      sections={parsedSections}
      keyExtractor={keyExtractor}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
    />
  );
};

const getItemLayout = sectionListGetItemLayout({
  getItemHeight: () => MANGA_HISTORY_ITEM_HEIGHT,
  getSectionHeaderHeight: () => MANGA_HISTORY_SECTION_HEADER_HEIGHT,
}) as unknown as (
  data: SectionListData<MangaHistory, HistorySection>[] | null,
  index: number,
) => {
  length: number;
  offset: number;
  index: number;
};

const renderSectionHeader: (info: {
  section: SectionListData<MangaHistory, HistorySection>;
}) => React.ReactElement = (s) => <SectionHeader date={s.section.date} />;
const renderItem: SectionListRenderItem<MangaHistory, HistorySection> = ({
  item,
  section,
}) => <MangaHistoryItem item={item} sectionDate={section.date} />;
const keyExtractor = (item: MangaHistory) => item.manga;

export default connector(History);
