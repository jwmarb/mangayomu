import React from 'react';
import { MangaSource } from '@mangayomu/mangascraper';
import { SectionListProps, SectionListRenderItem, View } from 'react-native';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { useExploreStore } from '@/stores/explore';
import Header, {
  HEADER_HEIGHT,
} from '@/screens/Home/tabs/Sources/components/Header';
import Source, {
  SOURCE_HEIGHT,
} from '@/screens/Home/tabs/Sources/components/Source';
import IconButton from '@/components/primitives/IconButton';
import Icon from '@/components/primitives/Icon';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/screens/Home/tabs/Sources/styles';
import useContrast from '@/hooks/useContrast';
import useUserInput from '@/hooks/useUserInput';
import useBoolean from '@/hooks/useBoolean';
import TextInput from '@/components/primitives/TextInput';

type Item = MangaSource;
type Section = { title?: string; data: readonly Item[] };

const renderItem: SectionListRenderItem<Item> = (info) => {
  return <Source source={info.item} />;
};

const renderSectionHeader: RenderSectionHeader<Item, Section> = ({
  section,
}) => {
  if (section.title == null) throw new Error('invalid title');
  return <Header text={section.title} />;
};

const getItemLayout: SectionListProps<Item, Section>['getItemLayout'] = (
  data,
  index,
) => {
  if (data == null) throw new Error('invalid data');

  switch (index) {
    case 0:
      return {
        index: 0,
        offset: 0,
        length:
          data[0].data.reduce((prev) => prev + SOURCE_HEIGHT, 0) +
          HEADER_HEIGHT,
      };
    case 1:
      return {
        offset:
          data[0].data.reduce((prev) => prev + SOURCE_HEIGHT, 0) +
          HEADER_HEIGHT,
        length:
          data[1].data.reduce((prev) => prev + SOURCE_HEIGHT, 0) +
          HEADER_HEIGHT,
        index: 1,
      };
  }

  return {
    index,
    length: 0,
    offset: 0,
  };
};

const keyExtractor = (item: Item) => item.NAME;

export default function Sources() {
  const pinnedSources = useExploreStore((state) => state.pinnedSources);
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const [showSearchBar, toggleSearchBar] = useBoolean();
  const { input, setInput } = useUserInput();
  const collapsible = useCollapsibleHeader(
    {
      title: 'Sources',
      headerLeftStyle: style.headerLeft,
      headerCenterStyle: style.headerCenter,
      headerRightStyle: style.headerRight,
      showHeaderRight: !showSearchBar,
      showHeaderLeft: !showSearchBar,
      headerCenter: showSearchBar ? (
        <TextInput
          placeholder="Search for a source..."
          iconButton
          onChangeText={setInput}
          icon={
            <IconButton
              onPress={() => toggleSearchBar(false)}
              icon={<Icon type="icon" name="arrow-left" />}
              size="small"
            />
          }
        />
      ) : undefined,
      headerRight: (
        <IconButton
          icon={<Icon type="icon" name="magnify" />}
          onPress={() => toggleSearchBar(true)}
        />
      ),
    },
    [showSearchBar],
  );

  const deferredInput = React.useDeferredValue(input);

  const data = React.useMemo(
    () => [
      {
        title: 'Pinned Sources',
        data: pinnedSources.filter((x) =>
          x.NAME.toLowerCase().trim().includes(deferredInput),
        ),
      },
      {
        title: 'All Sources',
        data: MangaSource.getAllSources().filter((x) =>
          x.NAME.toLowerCase().trim().includes(deferredInput),
        ),
      },
    ],
    [deferredInput],
  );
  return (
    <Screen.SectionList
      sections={data}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      getItemLayout={getItemLayout}
      keyExtractor={keyExtractor}
      collapsible={collapsible}
    />
  );
}
