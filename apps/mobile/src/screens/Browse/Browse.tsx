import React from 'react';
import { ListRenderItem, SectionList, SectionListData } from 'react-native';
import connector, { ConnectedBrowseProps } from './Browse.redux';
import Item from './components/Item';
import SectionHeader from './components/SectionHeader';

const Browse: React.FC<ConnectedBrowseProps> = (props) => {
  const { sources } = props;
  const data = React.useMemo(() => {
    return [
      {
        title: 'Pinned',
        data: [],
      },
      {
        title: 'Last used',
        data: [],
      },
      {
        title: 'Sources',
        data: sources,
      },
    ];
  }, [sources.length]);
  return (
    <SectionList
      sections={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      renderSectionHeader={renderSectionHeader}
    />
  );
};

const keyExtractor = (i: string) => i;

const renderItem: ListRenderItem<string> = ({ item }) => <Item item={item} />;
const renderSectionHeader = (info: {
  section: SectionListData<
    string,
    {
      title: string;
      data: string[];
    }
  >;
}) =>
  info.section.data.length > 0 ? (
    <SectionHeader title={info.section.title} />
  ) : null;

export default connector(Browse);
