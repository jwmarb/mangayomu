import Box from '@components/Box';
import Icon from '@components/Icon';
import Input from '@components/Input';
import { Stack } from '@components/Stack';
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

const Header: React.FC<ConnectedHeaderProps> = ({ setQuery, numSelected }) => {
  const bottomSheet =
    React.useRef<React.ElementRef<typeof CustomBottomSheet>>(null);
  function handleOnFilters() {
    bottomSheet.current?.snapToIndex(1);
  }
  const [index, setIndex] = React.useState<number>(0);
  React.useEffect(() => {
    console.log(index);
  }, [index]);
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
              <Text bold>{numSelected}</Text> source
              {numSelected === 1 ? '' : 's'} selected
            </Text>
          </Box>
          <IconButton
            icon={<Icon type="font" name="filter-menu" />}
            onPress={handleOnFilters}
          />
        </Stack>
        <Input
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

const Display = () => (
  <Box>
    <Text>Hello from Layout</Text>
  </Box>
);
const renderScene = SceneMap({
  filters: Filters,
  sort: Sort,
  display: Display,
});
const routes = [
  { key: 'filters', title: 'Filter' },
  { key: 'sort', title: 'Sort' },
  { key: 'display', title: 'Layout' },
];

export default connector(React.memo(Header));
