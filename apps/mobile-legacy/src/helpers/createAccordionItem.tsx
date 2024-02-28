/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import CheckboxItem, {
  CheckboxItemProps,
} from '@components/Filters/CheckboxItem';
import FilterItem, { FilterItemProps } from '@components/Filters/FilterItem';
import SelectItem, { SelectItemProps } from '@components/Filters/SelectItem';
import SortItem, { SortItemProps } from '@components/Filters/SortItem';

/**
 * Create an item component for an accordion
 * @param type The type of filter
 * @param Context The context that will be passed to the action prop
 * @param onActionKeyIdentifier The key within Context that will be invoked. SortItem will require two keys for onChange and onToggleReverse.
 * @example
 * [0] = onChange
 * [1] = onToggleReverse
 * @returns Returns a component that has an action built into it
 */
export default function createAccordionItem<
  T extends 'FilterItem' | 'SelectItem' | 'SortItem' | 'CheckboxItem',
  ContextState,
  S extends string & {},
>(
  type: T,
  Context: React.Context<ContextState>,
  onActionKeyIdentifier: (keyof NonNullable<ContextState>)[],
): React.FC<
  T extends 'FilterItem'
    ? Omit<FilterItemProps<S>, 'onToggle'>
    : T extends 'SelectItem'
    ? Omit<SelectItemProps<S>, 'onChange'>
    : T extends 'SortItem'
    ? Omit<SortItemProps<S>, 'onChange' | 'onToggleReverse'>
    : T extends 'CheckboxItem'
    ? Omit<CheckboxItemProps<S>, 'onToggle'>
    : never
> {
  return (props: any) => {
    return (
      <Context.Consumer>
        {(value: any) => {
          switch (type) {
            case 'CheckboxItem':
              return (
                <CheckboxItem
                  {...props}
                  onToggle={value[onActionKeyIdentifier[0]]}
                />
              );
            case 'FilterItem':
              return (
                <FilterItem
                  {...props}
                  onToggle={value[onActionKeyIdentifier[0]]}
                />
              );
            case 'SelectItem':
              return (
                <SelectItem
                  {...props}
                  onChange={value[onActionKeyIdentifier[0]]}
                />
              );
            case 'SortItem':
              return (
                <SortItem
                  {...props}
                  onChange={value[onActionKeyIdentifier[0]]}
                  onToggleReverse={value[onActionKeyIdentifier[1]]}
                />
              );
          }
        }}
      </Context.Consumer>
    );
  };
}
