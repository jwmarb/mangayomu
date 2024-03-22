import { ListRenderItem, View } from 'react-native';
import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { TextInput as NativeTextInput } from 'react-native-gesture-handler';
import { MangaSource } from '@mangayomu/mangascraper';
import Icon from '@/components/primitives/Icon';
import Screen from '@/components/primitives/Screen';
import TextInput from '@/components/primitives/TextInput';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { useBrowseStore } from '@/stores/browse';
import { useExploreStore } from '@/stores/explore';
import MangaBrowseList from '@/screens/Home/tabs/Browse/components/MangaBrowseList';
import Divider from '@/components/primitives/Divider';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';

const styles = createStyles((theme) => ({
  divider: {
    marginVertical: theme.style.size.m,
  },
}));

const renderItem: ListRenderItem<MangaSource> = ({ item }) => (
  <MangaBrowseList source={item} />
);

const keyExtractor = (item: MangaSource) => item.NAME;

function ItemSeparatorComponent() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  return <Divider style={style.divider} />;
}

export default function Browse() {
  const setQuery = useBrowseStore((state) => state.setQuery);
  const pinnedSources = useExploreStore((state) => state.pinnedSources);
  const inputRef = React.useRef<NativeTextInput>(null);

  const collapsible = useCollapsibleHeader({
    showHeaderLeft: false,
    showHeaderRight: false,
    disableCollapsing: true,
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
    <Screen.FlatList
      data={pinnedSources}
      ItemSeparatorComponent={ItemSeparatorComponent}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      collapsible={collapsible}
    />
  );
}
