import { CustomBottomSheet } from '@components/CustomBottomSheet';
import CustomTabs from '@components/CustomTabs';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import GlobalReaderSettings from '@screens/Reader/components/ReaderSettingsMenu/components/GlobalReaderSettings';
import LocalReaderSettings from '@screens/Reader/components/ReaderSettingsMenu/components/LocalReaderSettings';
import { ReaderSettingsMenuProps } from '@screens/Reader/components/ReaderSettingsMenu/ReaderSettingsMenu.interfaces';
import Advanced from './components/Advanced';
import React from 'react';
import Divider from '@components/Divider';

const ReaderSettingsMenu: React.ForwardRefRenderFunction<
  BottomSheetMethods,
  ReaderSettingsMenuProps
> = (props, ref) => {
  const [index, setIndex] = React.useState<number>(0);
  const { mangaKey } = props;
  const readerSettings = React.useMemo(
    () => (
      <>
        <LocalReaderSettings mangaKey={mangaKey} />
        <Divider />
        <GlobalReaderSettings />
      </>
    ),
    [mangaKey],
  );
  return (
    <CustomBottomSheet ref={ref}>
      <CustomTabs
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={({ route }) => {
          switch (route.key) {
            case 'reader':
              return readerSettings;
            case 'advanced':
              return <Advanced />;
          }
        }}
      />
    </CustomBottomSheet>
  );
};
const routes = [
  { key: 'reader', title: 'Reader' },
  { key: 'advanced', title: 'Advanced' },
];

export default React.memo(React.forwardRef(ReaderSettingsMenu));
