import { CustomBottomSheet } from '@components/CustomBottomSheet';
import CustomTabs from '@components/CustomTabs';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import GlobalReaderSettings from '@screens/Reader/components/ReaderSettingsMenu/components/GlobalReaderSettings';
import LocalReaderSettings from '@screens/Reader/components/ReaderSettingsMenu/components/LocalReaderSettings';
import { ReaderSettingsMenuProps } from '@screens/Reader/components/ReaderSettingsMenu/ReaderSettingsMenu.interfaces';
import Advanced from './components/Advanced';
import React from 'react';

const ReaderSettingsMenu: React.ForwardRefRenderFunction<
  BottomSheetMethods,
  ReaderSettingsMenuProps
> = (props, ref) => {
  const [index, setIndex] = React.useState<number>(0);
  const { mangaKey } = props;
  return (
    <CustomBottomSheet ref={ref} showIndicator={false}>
      <CustomTabs
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'local':
              return <LocalReaderSettings mangaKey={mangaKey} />;
            case 'global':
              return <GlobalReaderSettings />;
            case 'advanced':
              return <Advanced />;
          }
        }}
      />
    </CustomBottomSheet>
  );
};
const routes = [
  { key: 'local', title: 'For this series' },
  { key: 'global', title: 'Global' },
  { key: 'advanced', title: 'Advanced' },
];

export default React.memo(React.forwardRef(ReaderSettingsMenu));
