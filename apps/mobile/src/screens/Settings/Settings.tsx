import Divider from '@components/Divider';
import Icon from '@components/Icon';
import Text from '@components/Text';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import useRootNavigation from '@hooks/useRootNavigation';
import PressableListItem from '@screens/More/components/PressableListItem';
import MainSourceSelector from '@screens/Welcome/components/MainSourceSelector';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';

const Settings: React.FC = (props) => {
  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({ headerTitle: 'Settings' });
  const ref = React.useRef<BottomSheetMethods>(null);
  const navigation = useRootNavigation();
  const handleOnAppearance = React.useCallback(() => {
    navigation.navigate('Appearance');
  }, [navigation]);
  const handleOnSource = React.useCallback(() => {
    ref.current?.snapToIndex(1);
  }, []);
  return (
    <>
      <MainSourceSelector ref={ref} />
      <ScrollView
        onScroll={onScroll}
        contentContainerStyle={contentContainerStyle}
        style={scrollViewStyle}
      >
        <PressableListItem
          label="Reader"
          iconLeft={<Icon type="font" name="book" />}
        />
        <Divider />
        <PressableListItem
          label="Sources"
          onPress={handleOnSource}
          iconLeft={<Icon type="font" name="bookshelf" />}
        />
        <Divider />
        <PressableListItem
          onPress={handleOnAppearance}
          label="Appearance"
          iconLeft={<Icon type="font" name="palette" />}
        />
      </ScrollView>
    </>
  );
};

export default Settings;
