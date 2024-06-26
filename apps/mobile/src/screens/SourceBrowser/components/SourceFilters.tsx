import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import React from 'react';
import {
  GeneratedFilterSchema,
  MutableFilters,
} from '@mangayomu/schema-creator';
import { ListRenderItem } from 'react-native';
import { AscendingStringComparator, add } from '@mangayomu/algorithms';
import Text from '@/components/primitives/Text';
import useLoadAfterInteractions from '@/hooks/useLoadAfterInteractions';
import { useSourceContext } from '@/components/composites/Manga';
import Sort from '@/screens/SourceBrowser/components/Sort';
import Option from '@/screens/SourceBrowser/components/Option';
import Description from '@/screens/SourceBrowser/components/Description';
import InclusiveExclusive from '@/screens/SourceBrowser/components/InclusiveExclusive';
import {
  InclusiveExclusiveDispatcher,
  InclusiveExclusiveOperation,
  OptionDispatcher,
  OptionOperation,
  SortDispatcher,
} from '@/screens/SourceBrowser/components/shared';
import BottomSheet from '@/components/composites/BottomSheet';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import SourceFiltersHeader from '@/screens/SourceBrowser/components/SourceFiltersHeader';

type Item = [string, MutableFilters];

const keyExtractor = (value: Item) => value[0];

const renderItem: ListRenderItem<Item> = ({ item }) => {
  const [key, value] = item;
  switch (value.type) {
    case 'sort':
      return <Sort sort={value} title={key} />;
    case 'option':
      return <Option option={value} title={key} />;
    case 'description':
      return <Description description={value.description} />;
    case 'inclusive/exclusive':
      return <InclusiveExclusive inclusiveExclusive={value} title={key} />;
    default:
      return <Text>Not implemented for {key}</Text>;
  }
};

const styles = createStyles((theme) => ({
  contentContainerStyle: {
    paddingBottom: theme.style.size.xxl * 8,
  },
}));

type SourceFiltersProps = {
  filters: GeneratedFilterSchema;
  setFilters: React.Dispatch<React.SetStateAction<GeneratedFilterSchema>>;
  onApplyFilters: () => void;
};

function SourceFilters(
  props: SourceFiltersProps,
  ref: React.ForwardedRef<BottomSheet>,
) {
  const ready = useLoadAfterInteractions();
  const { filters, setFilters, onApplyFilters } = props;
  const source = useSourceContext();
  const INITIAL_FILTER_STATE =
    (source?.FILTER_SCHEMA?.schema as GeneratedFilterSchema) ?? {};
  const contrast = useContrast();
  const style = useStyles(styles, contrast);

  const data = React.useMemo(() => {
    if (source?.FILTER_SCHEMA == null) {
      return [];
    }

    return Object.entries(filters);
  }, [filters]);

  function handleOnResetFilters() {
    setFilters(INITIAL_FILTER_STATE);
  }

  const toggleInclusiveExclusive = React.useCallback(
    (operation: InclusiveExclusiveOperation) => {
      const { title, type, item } = operation;

      setFilters((prev) => {
        const filterObj = { ...prev[title] };
        if (filterObj.type === 'inclusive/exclusive') {
          switch (type) {
            case 'none': {
              filterObj.exclude = filterObj.exclude.filter((x) => x !== item);
              filterObj.include = filterObj.include.filter((x) => x !== item);
              break;
            }
            case 'exclude': {
              const exclude = [...filterObj.exclude];
              add(exclude, item, AscendingStringComparator);
              filterObj.exclude = exclude;
              filterObj.include = filterObj.include.filter((x) => x !== item);

              break;
            }
            case 'include': {
              const include = [...filterObj.include];
              add(include, item, AscendingStringComparator);
              filterObj.include = include;
              filterObj.exclude = filterObj.exclude.filter((x) => x !== item);
              break;
            }
          }
          return {
            ...prev,
            [title]: {
              ...filterObj,
            },
          };
        }
        return prev;
      });
    },
    [],
  );

  const setOption = React.useCallback((operation: OptionOperation) => {
    const { title, item } = operation;
    setFilters((prev) => {
      const filterObj = { ...prev[title] };
      if (filterObj.type === 'option') {
        return {
          ...prev,
          [title]: {
            ...filterObj,
            value: item,
          },
        };
      }
      return prev;
    });
  }, []);

  const setSort = React.useCallback((operation: OptionOperation) => {
    const { title, item } = operation;
    setFilters((prev) => {
      const filterObj = { ...prev[title] };
      if (filterObj.type === 'sort') {
        if (filterObj.value === item) {
          filterObj.reversed = !filterObj.reversed;
        } else {
          filterObj.value = item;
        }
        return {
          ...prev,
          [title]: {
            ...filterObj,
          },
        };
      }
      return prev;
    });
  }, []);

  if (!ready || source?.FILTER_SCHEMA == null) return null;

  return (
    <InclusiveExclusiveDispatcher.Provider value={toggleInclusiveExclusive}>
      <OptionDispatcher.Provider value={setOption}>
        <SortDispatcher.Provider value={setSort}>
          <BottomSheet ref={ref}>
            <BottomSheetFlatList
              showsVerticalScrollIndicator={false}
              contentContainerStyle={style.contentContainerStyle}
              data={data}
              renderItem={renderItem}
              keyExtractor={keyExtractor}
            />
            <SourceFiltersHeader
              onApplyFilters={onApplyFilters}
              onResetFilters={handleOnResetFilters}
            />
          </BottomSheet>
        </SortDispatcher.Provider>
      </OptionDispatcher.Provider>
    </InclusiveExclusiveDispatcher.Provider>
  );
}

export default React.forwardRef(SourceFilters);
