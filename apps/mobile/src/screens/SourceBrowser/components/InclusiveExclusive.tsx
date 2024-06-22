import { MutableInclusiveExclusiveFilter } from '@mangayomu/schema-creator';
import React from 'react';
import { FlatListProps, ListRenderItem, StyleSheet, View } from 'react-native';
import Text, { TextProps } from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import Icon from '@/components/primitives/Icon';
import {
  ITEM_HEIGHT,
  InclusiveExclusiveDispatcher,
  useInclusiveExclusiveDispatcher,
} from '@/screens/SourceBrowser/components/shared';
import Chip from '@/components/primitives/Chip';
import { ChipProps } from '@/components/primitives/Chip/Chip';
import Modal from '@/components/composites/Modal';
import useUserInput from '@/hooks/useUserInput';

const styles = createStyles((theme) => ({
  container: {
    paddingHorizontal: theme.style.screen.paddingHorizontal * 2,
    paddingVertical: theme.style.size.m,
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.style.size.s,
  },
  chipsContainer: {
    paddingHorizontal: theme.style.screen.paddingHorizontal * 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.style.size.s,
  },
  chip: {
    borderColor: theme.palette.divider,
    borderRadius: theme.style.borderRadius.m + 2,
    borderWidth: 1.5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  chipPressable: {
    flex: 0,
    flexDirection: 'row',
    paddingVertical: theme.style.size.m,
    paddingHorizontal: theme.style.size.l,
    alignItems: 'center',
    gap: theme.style.size.s,
  },
  text: {
    flexShrink: 1,
  },
}));

const { flexGrow, chipFilterItemHeight } = StyleSheet.create({
  flexGrow: {
    flexGrow: 1,
  },
  chipFilterItemHeight: {
    height: ITEM_HEIGHT,
  },
});

type InclusiveExclusiveProps = {
  title: string;
  inclusiveExclusive: MutableInclusiveExclusiveFilter<string>;
};

const included = <Icon type="icon" name="check" size="small" />;
const excluded = <Icon type="icon" name="cancel" size="small" />;

function toSimpleNoun(s: string) {
  if (s.charAt(s.length - 1) === 's') {
    return s.substring(0, s.length - 1).toLowerCase();
  }
  return s.toLowerCase();
}

const keyExtractor = (item: string) => item;

export const getItemLayout: FlatListProps<string>['getItemLayout'] = (
  data,
  index,
) => {
  return {
    index,
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
  };
};

const simpleChipFilterTextProps: TextProps = { color: 'textSecondary' };

function InclusiveExclusive(props: InclusiveExclusiveProps) {
  const { inclusiveExclusive, title } = props;
  const contrast = useContrast();
  const modalRef = React.useRef<Modal>(null);
  const style = useStyles(styles, contrast);
  const setInclusiveExclusive = useInclusiveExclusiveDispatcher();
  const { input, setInput } = useUserInput();
  const includeSet = React.useMemo(
    () => new Set(inclusiveExclusive.include),
    [inclusiveExclusive.include],
  );
  const excludeSet = React.useMemo(
    () => new Set(inclusiveExclusive.exclude),
    [inclusiveExclusive.exclude],
  );
  const deferredInput = React.useDeferredValue(input);
  const inputMap = React.useRef(new Map<string, string[]>());
  const data = React.useMemo(() => {
    if (deferredInput.length === 0) return inclusiveExclusive.fields;
    let cached = inputMap.current.get(deferredInput);
    if (cached != null) return cached;
    cached = inclusiveExclusive.fields.filter((x) => {
      const mappedTitle =
        inclusiveExclusive.map != null ? inclusiveExclusive.map[x] ?? x : x;
      return mappedTitle.toLowerCase().includes(deferredInput);
    });
    inputMap.current.set(deferredInput, cached);
    return cached;
  }, [deferredInput, inclusiveExclusive.fields]);
  function mapInclusiveExclusiveFields(x: string) {
    const mappedTitle =
      inclusiveExclusive.map != null ? inclusiveExclusive.map[x] ?? x : x;
    return (
      mapOnlyInclusiveExclusiveFields(x) || (
        <ChipFilter
          textProps={simpleChipFilterTextProps}
          filterKey={title}
          titleKey={x}
          key={x}
          title={mappedTitle}
        />
      )
    );
  }

  function mapOnlyInclusiveExclusiveFields(x: string) {
    const mappedTitle =
      inclusiveExclusive.map != null ? inclusiveExclusive.map[x] ?? x : x;
    if (excludeSet.has(x))
      return (
        <ChipFilter
          titleKey={x}
          filterKey={title}
          color="error"
          icon={excluded}
          key={x}
          title={mappedTitle}
        />
      );
    if (includeSet.has(x))
      return (
        <ChipFilter
          filterKey={title}
          titleKey={x}
          color="success"
          icon={included}
          key={x}
          title={mappedTitle}
        />
      );

    return null;
  }

  function handleOnPress() {
    modalRef.current?.show();
  }

  const renderItem: ListRenderItem<string> = React.useCallback(
    ({ item }) => {
      const mappedTitle =
        inclusiveExclusive.map != null
          ? inclusiveExclusive.map[item] ?? item
          : item;
      if (excludeSet.has(item))
        return (
          <FlatListFilterChipItem
            titleKey={item}
            filterKey={title}
            color="error"
            icon={excluded}
            title={mappedTitle}
          />
        );
      if (includeSet.has(item))
        return (
          <FlatListFilterChipItem
            filterKey={title}
            titleKey={item}
            color="success"
            icon={included}
            key={item}
            title={mappedTitle}
          />
        );

      return (
        <FlatListFilterChipItem
          textProps={simpleChipFilterTextProps}
          filterKey={title}
          titleKey={item}
          key={item}
          title={mappedTitle}
        />
      );
    },
    [inclusiveExclusive.map, includeSet, excludeSet, title],
  );

  return (
    <>
      <View style={style.container}>
        <Text numberOfLines={1}>{title}</Text>
      </View>
      <View style={style.chipsContainer}>
        {inclusiveExclusive.fields.length <= 12 &&
          inclusiveExclusive.fields.map(mapInclusiveExclusiveFields)}
        {inclusiveExclusive.fields.length > 12 && (
          <Chip
            icon={<Icon type="icon" name="plus" />}
            onPress={handleOnPress}
            title="Add filter"
            variant="filled"
          />
        )}
        {inclusiveExclusive.fields.length > 12 &&
          inclusiveExclusive.fields.map(mapOnlyInclusiveExclusiveFields)}
      </View>
      <Modal ref={modalRef}>
        <InclusiveExclusiveDispatcher.Provider value={setInclusiveExclusive}>
          <Modal.Header
            input
            placeholder={`Search for a ${toSimpleNoun(title)}...`}
            onChangeText={setInput}
          />
          <Modal.FlatList
            getItemLayout={getItemLayout}
            windowSize={9}
            maxToRenderPerBatch={9}
            updateCellsBatchingPeriod={50}
            keyboardShouldPersistTaps="handled"
            data={data}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
          />
        </InclusiveExclusiveDispatcher.Provider>
      </Modal>
    </>
  );
}

type ChipFilterProps = ChipProps & {
  filterKey: string;
  titleKey: string;
  flexGrow?: boolean;
};

const ChipFilter = React.memo((props: ChipFilterProps) => {
  const {
    color,
    title,
    filterKey,
    titleKey,
    flexGrow: flexGrowProp,
    ...rest
  } = props;
  const setInclusiveExclusive = useInclusiveExclusiveDispatcher();
  function onPress() {
    switch (color) {
      case 'error':
        setInclusiveExclusive({
          type: 'none',
          title: filterKey,
          item: titleKey,
        });
        break;
      case 'success':
        setInclusiveExclusive({
          type: 'exclude',
          title: filterKey,
          item: titleKey,
        });
        break;
      default:
        setInclusiveExclusive({
          type: 'include',
          title: filterKey,
          item: titleKey,
        });
        break;
    }
  }
  return (
    <Chip
      {...rest}
      onPress={onPress}
      title={title}
      color={color}
      style={flexGrowProp ? flexGrow : undefined}
    />
  );
});

const FlatListFilterChipItem = React.memo((props: ChipFilterProps) => (
  <View style={chipFilterItemHeight}>
    <ChipFilter {...props} flexGrow />
  </View>
));

export default React.memo(InclusiveExclusive);
