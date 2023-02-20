import SortItem from '@components/Filters/SortItem';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { LibrarySortOption, SORT_LIBRARY_OPTIONS } from '@redux/slices/library';
import React from 'react';
import { ListRenderItem } from 'react-native';
import connector, { ConnectedLibrarySortProps } from './Sort.redux';

const keyExtractor = (i: string) => i;

const Sort: React.FC<ConnectedLibrarySortProps> = (props) => {
  const { toggleLibraryReverse, sortBy, sortLibrary, reversed } = props;
  const renderItem: ListRenderItem<LibrarySortOption> = React.useCallback(
    ({ item }) => (
      <SortItem
        reversed={reversed}
        isSelected={sortBy === item}
        title={item}
        onChange={sortLibrary}
        onToggleReverse={toggleLibraryReverse}
      />
    ),
    [reversed, sortBy, sortLibrary, toggleLibraryReverse],
  );
  return (
    <BottomSheetFlatList
      data={SORT_LIBRARY_OPTIONS}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
    />
  );
};

export default connector(Sort);
