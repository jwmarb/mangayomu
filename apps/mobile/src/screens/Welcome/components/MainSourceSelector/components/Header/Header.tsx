import Box from '@components/Box';
import Icon from '@components/Icon';
import Input from '@components/Input';
import Stack from '@components/Stack';
import Text from '@components/Text';
import connector from './Header.redux';
import { ConnectedHeaderProps } from '@screens/Welcome/components/MainSourceSelector/components/Header/Header.redux';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import IconButton from '@components/IconButton';
import { CustomBottomSheet } from '@components/CustomBottomSheet';
import { SceneMap } from 'react-native-tab-view';
import CustomTabs from '@components/CustomTabs';
import Filters from './Tabs/Filters';
import Sort from '@screens/Welcome/components/MainSourceSelector/components/Header/Tabs/Sort';
import { Menu, MenuItem } from '@components/Menu';

const Header: React.FC<ConnectedHeaderProps> = ({
  setQuery,
  numSelected,
  index,
  setIndex,
  totalSources,
  query,
  addAllSources,
  removeAllSources,
}) => {
  const bottomSheet =
    React.useRef<React.ElementRef<typeof CustomBottomSheet>>(null);
  function handleOnFilters() {
    bottomSheet.current?.snapToIndex(1);
  }

  return (
    <>
      <Stack space={moderateScale(8)}>
        <Stack
          flex-direction="row"
          justify-content="space-between"
          align-items="center"
          space="s"
        >
          <Box>
            <Text variant="header">Select your main sources</Text>
            <Text color="textSecondary">
              <Text bold>
                {numSelected} / {totalSources}
              </Text>{' '}
              source
              {numSelected === 1 ? '' : 's'} selected
            </Text>
          </Box>
          <Stack space="s" flex-direction="row">
            <IconButton
              icon={<Icon type="font" name="filter-menu" />}
              onPress={handleOnFilters}
            />
            <Menu
              trigger={
                <IconButton icon={<Icon type="font" name="dots-vertical" />} />
              }
            >
              <MenuItem onPress={addAllSources}>Select all</MenuItem>
              <MenuItem onPress={removeAllSources}>Deselect all</MenuItem>
            </Menu>
          </Stack>
        </Stack>
        <Input
          defaultValue={query}
          icon={<Icon type="font" name="magnify" />}
          placeholder="Type a source name..."
          clearButtonMode="always"
          width="100%"
          onChangeText={setQuery}
        />
      </Stack>
      <CustomBottomSheet ref={bottomSheet}>
        <CustomTabs
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
        />
      </CustomBottomSheet>
    </>
  );
};

const renderScene = SceneMap({
  filters: Filters,
  sort: Sort,
});
const routes = [
  { key: 'filters', title: 'Filter' },
  { key: 'sort', title: 'Sort' },
];

export default connector(React.memo(Header));
