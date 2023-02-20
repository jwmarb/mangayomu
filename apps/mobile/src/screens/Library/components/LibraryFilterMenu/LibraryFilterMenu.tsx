import { CustomBottomSheet } from '@components/CustomBottomSheet';
import CustomTabs from '@components/CustomTabs';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React from 'react';
import { SceneMap } from 'react-native-tab-view';

import Filter from './Tabs/Filter';
import Sort from './Tabs/Sort';

const LibraryFilterMenu: React.ForwardRefRenderFunction<BottomSheetMethods> = (
  props,
  ref,
) => {
  const [index, setIndex] = React.useState<number>(0);
  return (
    <CustomBottomSheet ref={ref}>
      <CustomTabs
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
      />
    </CustomBottomSheet>
  );
};

const renderScene = SceneMap({
  filter: Filter,
  sort: Sort,
});
const routes = [
  {
    key: 'filter',
    title: 'Filter',
  },
  {
    key: 'sort',
    title: 'Sort',
  },
];

export default React.memo(React.forwardRef(LibraryFilterMenu));
