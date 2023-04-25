import Button from '@components/Button';
import { CustomBottomSheet } from '@components/CustomBottomSheet';
import Stack from '@components/Stack';
import { BottomSheetSectionList } from '@gorhom/bottom-sheet';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import React from 'react';
import { AdvancedSearchFiltersProps } from './AdvancedSearchFilters.interfaces';
import Description from './components/Description';
import Sort from './components/Sort';
import InclusiveExclusive from './components/InclusiveExclusive';
import Option from './components/Option';
import {
  StatefulInclusiveExclusive,
  StatefulOption,
  StatefulSort,
} from '@screens/InfiniteMangaList/InfiniteMangaList';
import { SectionListData, SectionListRenderItem } from 'react-native';
import {
  InclusiveExclusiveFilter,
  MutableInclusiveExclusiveFilter,
} from '@mangayomu/schema-creator';
import SectionHeader from '@screens/Library/components/LibraryFilterMenu/Tabs/Filter/components/SectionHeader';
import { FilterState } from '@redux/slices/mainSourceSelector';
import { useTheme } from '@emotion/react';

// <InclusiveExclusive
//   map={state.map}
//   key={x}
//   fields={state.fields}
//   name={x}
//   record={(activateState as StatefulInclusiveExclusive).record}
//   onToggleInclusiveExclusive={onToggleInclusiveExclusive}
// />

const AdvancedSearchFilters: React.ForwardRefRenderFunction<
  BottomSheetMethods,
  AdvancedSearchFiltersProps
> = (props, ref) => {
  const {
    dummyStates,
    keys,
    states,
    onChangeOption,
    onChangeSort,
    onToggleReverseSort,
    onToggleInclusiveExclusive,
    onApplyFilters,
    onResetFilters,
    accordionKeys,
  } = props;
  const [accordionStates, setAccordionStates] = React.useState<
    Record<string, boolean>
  >(
    accordionKeys.reduce((prev, curr) => {
      prev[curr] = false;
      return prev;
    }, {} as Record<string, boolean>),
  );
  const sections = React.useMemo(
    () =>
      accordionKeys.map((x) => ({
        title: x,
        data: (dummyStates[x] as MutableInclusiveExclusiveFilter<string>)
          .fields,
      })),
    [dummyStates, accordionKeys],
  );

  const handleOnToggle = React.useCallback(
    (key: string) => {
      setAccordionStates((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [setAccordionStates],
  );

  const renderSectionHeader = React.useCallback(
    (info: {
      section: SectionListData<
        string,
        {
          title: string;
          data: readonly string[];
        }
      >;
    }) => (
      <SectionHeader
        title={info.section.title}
        expanded={accordionStates[info.section.title]}
        toggle={handleOnToggle}
      />
    ),
    [handleOnToggle, accordionStates],
  );
  const renderItem: SectionListRenderItem<
    string,
    {
      title: string;
      data: readonly string[];
    }
  > = React.useCallback(
    ({ item: data, section: { title } }) => {
      if (!accordionStates[title]) return null;
      const x = states[title] as StatefulInclusiveExclusive;
      const dummy = dummyStates[title] as InclusiveExclusiveFilter<string>;
      return (
        <InclusiveExclusive
          title={dummy.map ? dummy.map[data] : data}
          fieldKey={title}
          state={x.record[data] ?? FilterState.ANY}
          itemKey={data}
          onToggleInclusiveExclusive={onToggleInclusiveExclusive}
        />
      );
    },
    [states, dummyStates, onToggleInclusiveExclusive, accordionStates],
  );

  const theme = useTheme();

  return (
    <CustomBottomSheet
      ref={ref}
      header={
        <Stack space="s" flex-direction="row" justify-content="space-between">
          <Button label="Reset" onPress={onResetFilters} />
          <Button
            label="Apply Filters"
            variant="contained"
            onPress={onApplyFilters}
          />
        </Stack>
      }
    >
      <BottomSheetSectionList
        contentContainerStyle={{ paddingVertical: theme.style.spacing.s }}
        ListHeaderComponent={
          <Stack space="s">
            {keys.map((x) => {
              const state = dummyStates[x];
              const activateState = states[x];
              switch (state.type) {
                case 'description':
                  return (
                    <Description key={x} description={state.description} />
                  );
                case 'option':
                  return (
                    <Option
                      map={state.map}
                      onChange={onChangeOption}
                      selected={(activateState as StatefulOption).selected}
                      name={x}
                      key={x}
                      options={state.options}
                    />
                  );
                case 'sort':
                  return (
                    <Sort
                      key={x}
                      options={state.options}
                      selected={(activateState as StatefulSort).selected}
                      reversed={(activateState as StatefulSort).reversed}
                      onChange={onChangeSort}
                      onToggleReverse={onToggleReverseSort}
                      name={x}
                    />
                  );
                default:
                  return null;
              }
            })}
          </Stack>
        }
        sections={sections}
        renderSectionHeader={renderSectionHeader}
        renderItem={renderItem}
      />
    </CustomBottomSheet>
  );
};

export default React.forwardRef(AdvancedSearchFilters);
