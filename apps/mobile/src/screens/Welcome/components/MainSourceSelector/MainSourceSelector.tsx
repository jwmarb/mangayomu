import Box from '@components/Box';
import Button from '@components/Button';
import { CustomBottomSheet } from '@components/CustomBottomSheet';
import Input from '@components/Input';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import { MangaHost } from '@mangayomu/mangascraper';
import connector, {
  ConnectedItemProps,
} from '@screens/Welcome/components/MainSourceSelector/MainSourceSelector.redux';
import React from 'react';
import { ListRenderItem } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  moderateScale,
  ScaledSheet,
  verticalScale,
} from 'react-native-size-matters';
import { MainSourceSelectorProps } from './MainSourceSelector.interfaces';

const MainSourceSelector = React.forwardRef<
  BottomSheetMethods,
  MainSourceSelectorProps
>((props, ref) => {
  const [data, setData] = React.useState<string[]>(MangaHost.getListSources());
  // const [comparator, setComparator] = React.useState<string>('alphabetical');
  const [query, setQuery] = React.useState<string>('');
  React.useEffect(() => {
    setData(
      MangaHost.getListSources().filter((x) =>
        x.trim().toLowerCase().includes(query.trim().toLowerCase()),
      ),
    );
  }, [query]);

  return (
    <CustomBottomSheet ref={ref}>
      <BottomSheetFlatList
        ListHeaderComponent={<Header setQuery={setQuery} />}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
      />
    </CustomBottomSheet>
  );
});

const keyExtractor = (k: string) => k;
const renderItem: ListRenderItem<string> = ({ item }) => {
  return <Item item={item} />;
};

const _Item: React.FC<ConnectedItemProps> = React.memo(
  ({ item, changeSource, isSelected }) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const host = MangaHost.getAvailableSources().get(item)!;
    function handleOnPress() {
      changeSource(host.getName());
    }
    return (
      <Box
        p={moderateScale(16)}
        flex-direction="row"
        justify-content="space-between"
      >
        <Stack flex-direction="row" space="m">
          <FastImage source={{ uri: host.getIcon() }} style={styles.icon} />

          <Stack>
            <Text bold>{host.getName()}</Text>
            <Text color="textSecondary">v{host.getVersion()}</Text>
          </Stack>
        </Stack>
        <Box>
          <Button
            label={isSelected ? 'Selected' : 'Set as main source'}
            variant={isSelected ? 'text' : 'outline'}
            disabled={isSelected}
            onPress={handleOnPress}
          />
        </Box>
      </Box>
    );
  },
);

const Item = connector(_Item);

const styles = ScaledSheet.create({
  icon: {
    width: '64@ms',
    height: '64@ms',
  },
});

const Header: React.FC<{
  setQuery: React.Dispatch<React.SetStateAction<string>>;
}> = React.memo(({ setQuery }) => (
  <Box m="l">
    <Stack space={verticalScale(8)}>
      <Text variant="header" align="center">
        Select a main source
      </Text>
      <Input
        placeholder="Type a source name..."
        clearButtonMode="always"
        width="100%"
        onChangeText={setQuery}
      />
    </Stack>
  </Box>
));

export default MainSourceSelector;
