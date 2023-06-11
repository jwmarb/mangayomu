import Button from '@components/Button';
import { CustomBottomSheet } from '@components/CustomBottomSheet';
import Stack from '@components/Stack';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
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
import {
  InclusiveExclusiveFilter,
  MutableInclusiveExclusiveFilter,
} from '@mangayomu/schema-creator';
import { FilterState } from '@redux/slices/mainSourceSelector';
import { useTheme } from '@emotion/react';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { AdvancedSearchFiltersContext } from '@screens/InfiniteMangaList/components/AdvancedSearchFilters/AdvancedSearchFilters.context';
import {
  ACCORDION_ITEM_HEIGHT,
  ACCORDION_SECTION_HEADER_HEIGHT,
} from '@theme/constants';
import InclusiveExclusiveHeader from '@screens/InfiniteMangaList/components/AdvancedSearchFilters/components/InclusiveExclusiveHeader';

type AccordionData =
  | { type: 'ACCORDION_HEADER'; title: string }
  | { type: 'ACCORDION_ITEM'; item: string; sectionTitle: string };

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
  const data = React.useMemo(() => {
    const arr: AccordionData[] = [];
    for (const section of accordionKeys) {
      arr.push({ type: 'ACCORDION_HEADER', title: section });
      if (accordionStates[section])
        for (const item of (
          dummyStates[section] as MutableInclusiveExclusiveFilter<string>
        ).fields) {
          arr.push({ type: 'ACCORDION_ITEM', item, sectionTitle: section });
        }
    }
    return arr;
  }, [accordionStates]);

  const handleOnToggle = React.useCallback(
    (key: string) => {
      setAccordionStates((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [setAccordionStates],
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
      <BottomSheetScrollView
        contentContainerStyle={{ paddingVertical: theme.style.spacing.s }}
      >
        <AdvancedSearchFiltersContext.Provider
          value={React.useMemo(
            () => ({ onToggleInclusiveExclusive, toggle: handleOnToggle }),
            [handleOnToggle, onToggleInclusiveExclusive],
          )}
        >
          <FlashList
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
            data={data}
            extraData={{ states, dummyStates, accordionStates }}
            getItemType={getItemType}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            estimatedItemSize={ACCORDION_SECTION_HEADER_HEIGHT}
            overrideItemLayout={overrideItemLayout}
          />
        </AdvancedSearchFiltersContext.Provider>
      </BottomSheetScrollView>
    </CustomBottomSheet>
  );
};

const overrideItemLayout: (
  layout: {
    span?: number | undefined;
    size?: number | undefined;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  },
  item: AccordionData,
  index: number,
  maxColumns: number,
  extraData?: any,
) => void = (layout, item) => {
  switch (item.type) {
    case 'ACCORDION_HEADER':
      layout.size = ACCORDION_SECTION_HEADER_HEIGHT;
      break;
    case 'ACCORDION_ITEM':
      layout.size = ACCORDION_ITEM_HEIGHT;
      break;
  }
};

const keyExtractor = (_: AccordionData, i: number) => String(i);

const getItemType = (item: AccordionData) => item.type;

const renderItem: ListRenderItem<AccordionData> = ({ item, extraData }) => {
  switch (item.type) {
    case 'ACCORDION_HEADER':
      return (
        <InclusiveExclusiveHeader
          title={item.title}
          expanded={extraData.accordionStates[item.title]}
        />
      );
    case 'ACCORDION_ITEM': {
      const x = extraData.states[
        item.sectionTitle
      ] as StatefulInclusiveExclusive;
      const dummy = extraData.dummyStates[
        item.sectionTitle
      ] as InclusiveExclusiveFilter<string>;
      return (
        <InclusiveExclusive
          title={dummy.map ? dummy.map[item.item] : item.item}
          fieldKey={item.sectionTitle}
          state={x.record[item.item] ?? FilterState.ANY}
          itemKey={item.item}
        />
      );
    }
  }
};

export default React.forwardRef(AdvancedSearchFilters);
