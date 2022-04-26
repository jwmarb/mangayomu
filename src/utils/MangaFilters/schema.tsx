import {
  Typography,
  Modal,
  Flex,
  Button,
  Accordion,
  HeaderBuilder,
  Container,
  SortTypeItem,
  Icon,
} from '@components/core';
import { binary, StringComparator } from '@utils/Algorithms';
import InclusiveExclusiveItem from '@utils/MangaFilters/components/InclusiveExclusiveItem';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

type InclusiveExclusiveFilter<T> = {
  type: 'inclusive/exclusive';
  fields: readonly T[];
};

type SortFilter<T> = {
  type: 'sort';
  options: readonly T[];
  default: T;
};

type OptionFilter<T> = {
  type: 'option';
  options: readonly T[];
  default: T;
};

type ConstRecord<T> = {
  [P in keyof T]: T[P] extends string
    ? string extends T[P]
      ? string
      : T[P]
    : T[P] extends number
    ? number extends T[P]
      ? number
      : T[P]
    : T[P] extends boolean
    ? boolean extends T[P]
      ? boolean
      : T[P]
    : ConstRecord<T[P]>;
};

type Const<T> = T extends string ? T : T extends number ? T : T extends boolean ? T : ConstRecord<T>;

export type FilterModalProps = {
  show: boolean;
  onClose: () => void;
  onApplyFilter: (state: FilterState) => void;
};

export type FilterState = Record<string, Record<string, any>>;

export type FilterSchemaObject<T> = {
  FilterModal: React.FC<FilterModalProps>;
  schema: T;
};

function createSortFilter<T>(obj: Omit<SortFilter<T>, 'type'>) {
  return {
    ...obj,
    type: 'sort' as const,
    value: obj.default as T,
    reversed: false,
  };
}

function createInclusiveExclusiveFilter<T>(obj: Omit<InclusiveExclusiveFilter<T>, 'type'>) {
  return {
    ...obj,
    type: 'inclusive/exclusive' as const,
    include: [] as readonly T[],
    exclude: [] as readonly T[],
  };
}

function createOptionFilter<T>(obj: Omit<OptionFilter<T>, 'type'>) {
  return {
    ...obj,
    type: 'option' as const,
    value: obj.default as T,
  };
}

export type MutableSortFilter<T> = SortFilter<Const<T>> & {
  value: Const<T>;
  reversed: boolean;
};

export type MutableInclusiveExclusiveFilter<T> = InclusiveExclusiveFilter<Const<T>> & {
  include: readonly Const<T>[];
  exclude: readonly Const<T>[];
};
export type MutableOptionFilter<T> = OptionFilter<Const<T>> & { value: Const<T> };

type FilterCreators = {
  createInclusiveExclusiveFilter<T>(
    obj: Omit<InclusiveExclusiveFilter<Const<T>>, 'type'>
  ): MutableInclusiveExclusiveFilter<T>;
  createOptionFilter<T>(obj: Omit<OptionFilter<Const<T>>, 'type'>): MutableOptionFilter<T>;
  createSortFilter<T>(obj: Omit<SortFilter<Const<T>>, 'type'>): MutableSortFilter<T>;
};

export function createSchema<T>(object: (filterCreators: FilterCreators) => T) {
  const p = object({ createInclusiveExclusiveFilter, createOptionFilter, createSortFilter });
  const elements: React.FC<{
    setParentState: React.Dispatch<React.SetStateAction<FilterState>>;
    state: MutableSortFilter<any> | MutableInclusiveExclusiveFilter<any> | MutableOptionFilter<any>;
  }>[] = [];
  const objectKeys = Object.keys(p);
  for (const [key, value] of Object.entries<any>(p)) {
    switch (value.type) {
      case 'sort':
        elements.push(
          React.memo(({ setParentState, state: parentState }) => {
            const state = parentState as MutableSortFilter<any>;
            const [show, setShow] = React.useState<boolean>(false);

            const setReverse = React.useCallback(
              (rev: (prev: boolean) => boolean) => {
                setParentState((prev) => ({
                  ...prev,
                  [key]: {
                    ...prev[key],
                    reversed: rev(prev[key].reversed),
                  },
                }));
              },
              [setParentState]
            );

            const setSort = React.useCallback(
              (value: string) => {
                setParentState((prev) => ({
                  ...prev,
                  [key]: {
                    ...prev[key],
                    value: value,
                  },
                }));
              },
              [setParentState]
            );

            return (
              <Accordion title={key} expand={show} onToggle={setShow}>
                {state.options.map((x) => (
                  <SortTypeItem
                    key={x}
                    selected={x === state.value}
                    sortBy={x}
                    setSort={setSort}
                    reverse={state.reversed}
                    setReverse={setReverse}
                  />
                ))}
              </Accordion>
            );
          })
        );
        break;

      case 'inclusive/exclusive':
        elements.push(
          React.memo(({ setParentState, state: parentState }) => {
            const state = parentState as MutableInclusiveExclusiveFilter<any>;
            const [show, setShow] = React.useState<boolean>(false);
            const getStateOfItem = (item: any) => {
              if (binary.search(state.include as string[], item, StringComparator) !== -1) return 'include';
              else if (binary.search(state.exclude as string[], item, StringComparator) !== -1) return 'exclude';
              else return 'none';
            };

            const handleStateChanger = React.useCallback(
              (fn: (prev: MutableInclusiveExclusiveFilter<any>) => MutableInclusiveExclusiveFilter<any>) => {
                setParentState((prev) => ({ ...prev, [key]: fn(prev[key] as any) }));
              },
              [setParentState, key]
            );

            return (
              <Accordion title={key} expand={show} onToggle={setShow}>
                {state.fields.map((x, i) => {
                  return (
                    <InclusiveExclusiveItem
                      item={x}
                      state={getStateOfItem(x)}
                      key={i}
                      stateChanger={handleStateChanger}
                    />
                  );
                })}
              </Accordion>
            );
          })
        );
        break;
      case 'option':
        elements.push(
          React.memo(({ setParentState, state: parentState }) => {
            const state = parentState as MutableOptionFilter<any>;

            const menuItems: MenuItemProps[] = React.useMemo(
              () => [
                { text: key, isTitle: true, withSeparator: true },
                ...state.options.map<MenuItemProps>((x) => ({
                  text: x,
                  onPress: () => {
                    setParentState((prev) => ({
                      ...prev,
                      [key]: {
                        ...prev[key],
                        value: x,
                      },
                    }));
                  },
                })),
              ],
              [state.options, setParentState]
            );

            return (
              <HoldItem activateOn='tap' items={menuItems}>
                <Flex
                  justifyContent='space-between'
                  alignItems='center'
                  container
                  verticalPadding={1}
                  horizontalPadding={3}>
                  <Typography>{key}</Typography>
                  <Button
                    title={state.value}
                    icon={<Icon bundle='Feather' name='chevron-down' />}
                    iconPlacement='right'
                  />
                </Flex>
              </HoldItem>
            );
          })
        );
        break;
    }
  }

  const filterSchemaObject: FilterSchemaObject<T> = {
    FilterModal: ({ onClose, show, onApplyFilter }) => {
      const [filter, setFilterState] = React.useState<T>(p);
      const handleOnReset = React.useCallback(() => {
        setFilterState(p);
      }, []);

      const handleOnApplyFilters = React.useCallback(() => {
        onApplyFilter(filter as any);
        onClose();
      }, [filter, onApplyFilter]);
      return (
        <Modal visible={show} onClose={onClose}>
          <HeaderBuilder paper horizontalPadding verticalPadding={0}>
            <Flex grow justifyContent='space-between'>
              <Button title='Reset' onPress={handleOnReset} />
              <Button title='Apply' variant='contained' onPress={handleOnApplyFilters} />
            </Flex>
          </HeaderBuilder>
          {elements.map((Component, i) => (
            <Component key={i} setParentState={setFilterState as any} state={(filter as any)[objectKeys[i]] as any} />
          ))}
        </Modal>
      );
    },
    schema: p as any,
  };

  return filterSchemaObject;
}
