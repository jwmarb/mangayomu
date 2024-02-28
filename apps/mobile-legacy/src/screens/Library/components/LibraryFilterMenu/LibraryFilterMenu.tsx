import { CustomBottomSheet } from '@components/CustomBottomSheet';
import CustomTabs from '@components/CustomTabs';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React from 'react';
import { LibraryFilterMenuProps } from './LibraryFilterMenu.interfaces';
import Filter from './Tabs/Filter';
import Sort from './Tabs/Sort';

const LibraryFilterMenu: React.ForwardRefRenderFunction<
  BottomSheetMethods,
  LibraryFilterMenuProps
> = ({ filtered }, ref) => {
  const [index, setIndex] = React.useState<number>(0);
  return (
    <CustomBottomSheet ref={ref}>
      <CustomTabs
        navigationState={{ index, routes }}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'filter':
              return <Filter filtered={filtered} />;
            case 'sort':
              return <Sort />;
          }
        }}
        onIndexChange={setIndex}
      />
    </CustomBottomSheet>
  );
};
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
