import { View } from 'react-native';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { TextInput as NativeTextInput } from 'react-native-gesture-handler';
import Icon from '@/components/primitives/Icon';
import Screen from '@/components/primitives/Screen';
import Text from '@/components/primitives/Text';
import TextInput from '@/components/primitives/TextInput';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { useBrowseStore } from '@/stores/browse';

export default function Browse() {
  const setQuery = useBrowseStore((state) => state.setQuery);
  const inputRef = React.useRef<NativeTextInput>(null);
  const collapsible = useCollapsibleHeader({
    showHeaderLeft: false,
    showHeaderRight: false,
    headerCenter: (
      <TextInput
        ref={inputRef}
        placeholder="Search for a manga..."
        onSubmitEditing={(e) => setQuery(e.nativeEvent.text)}
        icon={<Icon type="icon" name="magnify" />}
      />
    ),
  });
  useFocusEffect(
    React.useCallback(() => {
      inputRef.current?.focus();
    }, []),
  );
  return (
    <Screen collapsible={collapsible}>
      <Text variant="h4">MangaSee</Text>
      <View style={{ height: 2000 }} />
    </Screen>
  );
}
