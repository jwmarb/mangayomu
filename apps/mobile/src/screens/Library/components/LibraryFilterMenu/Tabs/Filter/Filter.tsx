import Box from '@components/Box';
import CheckboxItem from '@components/Filters/CheckboxItem';
import Text from '@components/Text';

import { BottomSheetSectionListProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types';

import { FilterState } from '@redux/slices/mainSourceSelector';
import FilterItem from '@components/Filters/FilterItem';
import React from 'react';
import connector, { ConnectedLibraryFilterProps } from './Filter.redux';
import {
  BottomSheetScrollView,
  BottomSheetSectionList,
} from '@gorhom/bottom-sheet';
import Accordion from '@components/Accordion';
import { Stack } from '@components/Stack';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeOut,
  FadeOutUp,
  SlideInDown,
  SlideInUp,
  SlideOutUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { ListRenderItem, SectionListData } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Button from '@components/Button';
import { moderateScale } from 'react-native-size-matters';
import { useTheme } from '@emotion/react';
const keyExtractor = (x: string, i: number) => x + i;

interface SectionHeaderProps {
  toggle: (key: string) => void;
  title: string;
  expanded: boolean;
}
const SectionHeader: React.FC<SectionHeaderProps> = React.memo(
  ({ title, toggle, expanded }) => {
    const rotate = useSharedValue(expanded ? 180 : 0);
    React.useEffect(() => {
      if (expanded)
        rotate.value = withTiming(180, { duration: 150, easing: Easing.ease });
      else rotate.value = withTiming(0, { duration: 150, easing: Easing.ease });
    }, [expanded]);
    const iconStyle = useAnimatedStyle(() => ({
      transform: [{ rotate: rotate.value + 'deg' }],
    }));
    const handleOnPress = () => toggle(title);
    return (
      <TouchableWithoutFeedback onPress={handleOnPress}>
        <Stack
          mx="m"
          my="s"
          flex-direction="row"
          space="s"
          justify-content="space-between"
          align-items="center"
        >
          <Text bold>{title}</Text>
          <IconButton
            icon={<Icon style={iconStyle} type="font" name="chevron-down" />}
            animated
            onPress={handleOnPress}
            compact
          />
        </Stack>
      </TouchableWithoutFeedback>
    );
  },
);

const Filter: React.FC<ConnectedLibraryFilterProps> = (props) => {
  const {
    host,
    hosts,
    filterStates,
    toggleGenre,
    toggleSourceVisibility,
    resetFilters,
  } = props;
  const onResetFilter = () => {
    resetFilters(hosts);
  };
  const [genresSet, genres] = host.getUniqGenres();
  const data = React.useRef([
    {
      title: 'Sources',
      data: hosts,
    },
    {
      title: 'Genres',
      data: genres,
    },
  ]).current;
  const [state, setState] = React.useState({
    Sources: true,
    Genres: false,
  });

  const toggle = React.useCallback(
    (key: string) => {
      setState((s) => ({ ...s, [key]: !s[key as keyof typeof state] }));
    },
    [setState],
  );

  const renderSectionHeader = React.useCallback(
    ({ section }: { section: SectionListData<string> }) => (
      <SectionHeader
        title={section.title}
        expanded={state[section.title as keyof typeof state]}
        toggle={toggle}
      />
    ),
    [toggle, state],
  );

  const renderItem: ListRenderItem<string> = React.useCallback(
    ({ item }) =>
      state[genresSet.has(item) ? 'Genres' : 'Sources'] ? (
        genresSet.has(item) ? (
          <FilterItem
            key={item}
            title={item}
            itemKey={item}
            state={filterStates.Genres[item] ?? FilterState.ANY}
            onToggle={toggleGenre}
          />
        ) : (
          <CheckboxItem
            key={item}
            title={item}
            checked={item in filterStates.Sources}
            onToggle={toggleSourceVisibility}
            itemKey={item}
          />
        )
      ) : null,
    [
      state,
      filterStates.Genres,
      filterStates.Sources,
      toggleSourceVisibility,
      toggleGenre,
      genresSet,
    ],
  );

  return (
    <BottomSheetSectionList
      ListHeaderComponent={
        <Box mx="m" my="s">
          <Button label="Reset Filters" onPress={onResetFilter} />
        </Box>
      }
      sections={data}
      keyExtractor={keyExtractor}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
    />
  );
};

export default connector(Filter);
