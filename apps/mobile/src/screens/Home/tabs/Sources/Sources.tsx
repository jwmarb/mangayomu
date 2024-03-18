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
  const collapsible = useCollapsibleHeader({ title: 'Sources' });
  const data = React.useMemo((): Section[] => {
    return [
      {
        title: 'Pinned Sources',
        data: pinnedSources,
      },
      {
        title: 'All Sources',
        data: MangaSource.getAllSources(),
      },
    ];
  }, [pinnedSources]);
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
