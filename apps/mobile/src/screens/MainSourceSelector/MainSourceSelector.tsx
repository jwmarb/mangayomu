import Box from '@components/Box';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import Item from '@screens/Welcome/components/MainSourceSelector/components/Item';
import { ListRenderItem } from 'react-native';
import connector, {
  ConnectedMainSourceSelectorProps,
} from './MainSourceSelector.redux';
import { MangaHost } from '@mangayomu/mangascraper';
import { applyFilterState } from '@redux/slices/mainSourceSelector';
import { SORT_HOSTS_BY } from '@redux/slices/host';
import Text from '@components/Text';
import useBoolean from '@hooks/useBoolean';
import Input from '@components/Input';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Stack from '@components/Stack';
import { MangaSourceSelectorFilters } from '@screens/Welcome/components/MainSourceSelector/components/Header/Header';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import Animated from 'react-native-reanimated';
const state = MangaHost.getListSources();

const MainSourceSelector: React.FC<ConnectedMainSourceSelectorProps> = (
  props,
) => {
  const {
    query,
    sort,
    reversed,
    filters: { showNSFW, hasHotUpdates, hasLatestUpdates, hasMangaDirectory },
    setQuery,
    navigation,
  } = props;
  const [show, toggle] = useBoolean();
  const bottomSheet = React.useRef<BottomSheetMethods>(null);
  const { onScroll, scrollViewStyle, contentContainerStyle } =
    useCollapsibleHeader({
      header: (
        <Stack
          mx="m"
          flex-direction="row"
          space="s"
          align-items="center"
          justify-content="space-between"
          flex-grow
        >
          <Stack space="s" flex-direction="row" align-items="center" flex-grow>
            {show ? (
              <Input
                expanded
                defaultValue={query}
                placeholder="Type a source name..."
                clearButtonMode="always"
                onChangeText={setQuery}
                iconButton={
                  <IconButton
                    icon={<Icon type="font" name="arrow-left" />}
                    onPress={() => toggle(false)}
                  />
                }
              />
            ) : (
              <>
                <IconButton
                  color="textPrimary"
                  icon={<Icon type="font" name="arrow-left" />}
                  onPress={() => navigation.goBack()}
                />
                <Text bold variant="header">
                  Sources
                </Text>
              </>
            )}
          </Stack>
          <Box flex-direction="row">
            {!show && (
              <IconButton
                icon={<Icon type="font" name="magnify" />}
                onPress={() => toggle(true)}
              />
            )}
            <IconButton
              icon={<Icon type="font" name="filter" />}
              onPress={() => bottomSheet.current?.snapToIndex(1)}
            />
          </Box>
        </Stack>
      ),
      showBackButton: false,
      showHeaderRight: false,
      dependencies: [show, toggle, query, setQuery],
    });

  const [data, setData] = React.useState<string[]>(state);

  React.useEffect(() => {
    setData(
      state
        .filter((x) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const host = MangaHost.getAvailableSources().get(x)!;
          return (
            x.trim().toLowerCase().includes(query.trim().toLowerCase()) &&
            applyFilterState(host.hasHotMangas(), hasHotUpdates) &&
            applyFilterState(host.hasLatestMangas(), hasLatestUpdates) &&
            applyFilterState(host.isAdult(), showNSFW) &&
            applyFilterState(host.hasMangaDirectory(), hasMangaDirectory)
          );
        })
        .sort(SORT_HOSTS_BY[sort](reversed)),
    );
  }, [
    query,
    showNSFW,
    hasHotUpdates,
    hasLatestUpdates,
    hasMangaDirectory,
    sort,
    reversed,
  ]);

  return (
    <>
      <MangaSourceSelectorFilters ref={bottomSheet} />
      <Animated.FlatList
        ListHeaderComponent={<Box style={scrollViewStyle} />}
        ListFooterComponent={<Box style={contentContainerStyle} />}
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onScroll={onScroll}
      />
    </>
  );
};

const renderItem: ListRenderItem<string> = ({ item }) => <Item item={item} />;
const keyExtractor = (item: string, i: number) => item + i;

export default connector(MainSourceSelector);
