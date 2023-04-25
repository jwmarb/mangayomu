import Divider from '@components/Divider';
import Icon from '@components/Icon';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import useRootNavigation from '@hooks/useRootNavigation';
import PressableListItem from '@screens/More/components/PressableListItem';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';

const Settings: React.FC = () => {
  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({ headerTitle: 'Settings' });
  const navigation = useRootNavigation();
  const handleOnAppearance = React.useCallback(() => {
    navigation.navigate('Appearance');
  }, [navigation]);
  const handleOnSource = React.useCallback(() => {
    navigation.navigate('MainSourceSelector');
  }, [navigation]);
  return (
    <>
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
