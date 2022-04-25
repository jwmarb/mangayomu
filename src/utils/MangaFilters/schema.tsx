import { Typography, Modal, Flex, Button, Accordion, HeaderBuilder } from '@components/core';
import { binary, StringComparator } from '@utils/Algorithms';
import InclusiveExclusiveItem from '@utils/MangaFilters/components/InclusiveExclusiveItem';
import React from 'react';
import { useWindowDimensions } from 'react-native';

type InclusiveExclusiveFilter<T> = {
  type: 'inclusive/exclusive';
  fields: readonly T[];
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
  setFilterState: React.Dispatch<React.SetStateAction<Partial<FilterState>>>;
};

export type FilterState = Record<string, unknown>;

export type FilterSchemaObject<T> = {
  FilterModal: React.FC<FilterModalProps>;
  schema: T;
};

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
};

export function createSchema<T>(object: (filterCreators: FilterCreators) => Partial<T>) {
  const p = object({ createInclusiveExclusiveFilter, createOptionFilter });
  const elements: React.FC<{ setParentState: React.Dispatch<React.SetStateAction<Partial<FilterState>>> }>[] = [];
  for (const [key, value] of Object.entries<any>(p)) {
    switch (value.type) {
      case 'inclusive/exclusive':
        elements.push(
          React.memo(({ setParentState }) => {
            const [state, setState] = React.useState<MutableInclusiveExclusiveFilter<any>>(value);
            const [show, setShow] = React.useState<boolean>(false);
            React.useEffect(() => {
              setParentState((prev) => ({ ...prev, state }));
            }, [state]);
            const getStateOfItem = (item: any) => {
              if (binary.search(state.include as string[], item, StringComparator) !== -1) return 'include';
              else if (binary.search(state.exclude as string[], item, StringComparator) !== -1) return 'exclude';
              else return 'none';
            };

            return (
              <Accordion title={key} expand={show} onToggle={setShow}>
                {state.fields.map((x, i) => {
                  return <InclusiveExclusiveItem item={x} state={getStateOfItem(x)} key={i} stateChanger={setState} />;
                })}
              </Accordion>
            );
          })
        );
        break;
      case 'option':
        elements.push(
          React.memo(() => {
            return <Typography>{key}</Typography>;
          })
        );
        break;
    }
  }

  const filterSchemaObject: FilterSchemaObject<T> = {
    FilterModal: ({ onClose, show, setFilterState }) => {
      const { height } = useWindowDimensions();
      return (
        <Modal visible={show} onClose={onClose}>
          <HeaderBuilder paper horizontalPadding verticalPadding={0}>
            <Flex grow justifyContent='space-between'>
              <Button title='Reset' />
              <Button title='Apply' variant='contained' />
            </Flex>
          </HeaderBuilder>
          {elements.map((Component, i) => (
            <Component key={i} setParentState={setFilterState} />
          ))}
        </Modal>
      );
    },
    schema: p as any,
  };

  return filterSchemaObject;
}
