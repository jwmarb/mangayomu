import Box from '@components/Box';
import CheckboxItem from '@components/Filters/CheckboxItem';
import Text from '@components/Text';

import { BottomSheetSectionListProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types';

import { FilterState } from '@redux/slices/mainSourceSelector';
import FilterItem from '@components/Filters/FilterItem';
import React from 'react';
import connector, { ConnectedLibraryFilterProps } from './Filter.redux';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import Accordion from '@components/Accordion';

const Filter: React.FC<ConnectedLibraryFilterProps> = (props) => {
  const { host, hosts, filterStates, toggleGenre, toggleSourceVisibility } =
    props;
  const [set, genres] = host.getUniqGenres();

  return (
    <BottomSheetScrollView>
      <Accordion title="Sources" containerProps={{ mx: 'm', my: 's' }}>
        {hosts.map((x) => (
          <CheckboxItem
            key={x}
            title={x}
            checked={filterStates.Sources[x]}
            onToggle={toggleSourceVisibility}
            itemKey={x}
          />
        ))}
      </Accordion>
      <Accordion title="Genres" containerProps={{ mx: 'm', my: 's' }}>
        {genres.map((x) => (
          <FilterItem
            key={x}
            title={x}
            itemKey={x}
            state={filterStates.Genres[x] ?? FilterState.ANY}
            onToggle={toggleGenre}
          />
        ))}
      </Accordion>
    </BottomSheetScrollView>
  );
};

export default connector(Filter);
