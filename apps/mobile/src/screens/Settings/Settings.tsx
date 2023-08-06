import Divider from '@components/Divider';
import Icon from '@components/Icon';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import useRootNavigation from '@hooks/useRootNavigation';
import PressableListItem from '@screens/More/components/PressableListItem';
import React from 'react';
import { ScrollView } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const Settings: React.FC<ReturnType<typeof useCollapsibleHeader>> = ({
  onScroll,
  contentContainerStyle,
  scrollViewStyle,
}) => {
  const navigation = useRootNavigation();
  const handleOnAppearance = React.useCallback(() => {
    navigation.navigate('Appearance');
  }, [navigation]);
  const handleOnSource = React.useCallback(() => {
    navigation.navigate('MainSourceSelector');
  }, [navigation]);
  const handleOnReaderSettings = React.useCallback(() => {
    navigation.navigate('GlobalReaderSettings');
  }, [navigation]);
  return (
    <>
      <Animated.ScrollView
        onScroll={onScroll}
        contentContainerStyle={contentContainerStyle}
        style={scrollViewStyle}
      >
        <PressableListItem
          onPress={handleOnReaderSettings}
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
      </Animated.ScrollView>
    </>
  );
};

export default Settings;
