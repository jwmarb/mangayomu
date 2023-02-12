import { CustomBottomSheet } from '@components/CustomBottomSheet';
import CustomTabs from '@components/CustomTabs';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { MangaViewModalProps } from '@screens/MangaView/components/MangaViewModal/MangaViewModal.interfaces';
import React from 'react';
import Sort from './Tabs/Sort';

const MangaViewModal: React.ForwardRefRenderFunction<
  BottomSheetMethods,
  MangaViewModalProps
> = (props, ref) => {
  const [index, setIndex] = React.useState<number>(0);
  return (
    <CustomBottomSheet ref={ref}>
      <CustomTabs
        navigationState={{ index, routes }}
        renderScene={({ route, jumpTo }) => {
          switch (route.key) {
            case 'sort':
              return (
                <Sort
                  mangaLink={props.mangaLink}
                  reversed={props.reversed}
                  sortMethod={props.sortMethod}
                />
              );
            case 'language':
            case 'display':
              return null;
          }
        }}
        onIndexChange={setIndex}
      />
    </CustomBottomSheet>
  );
};

const routes = [
  {
    key: 'sort',
    title: 'Sort',
  },
  {
    key: 'language',
    title: 'Language',
  },
  {
    key: 'display',
    title: 'Display',
  },
];

export default React.forwardRef(MangaViewModal);
