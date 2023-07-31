import Checkbox from '@app/components/Checkbox';
import {
  useFilterMappedContext,
  useFilterOnChangeContext,
  useFilterSelectedContext,
  useFilterUniqContext,
} from '@app/components/Filter/filter';
import Text from '@app/components/Text';
import React, { useId } from 'react';
import { useButton } from 'react-aria';

interface CheckboxProps<T> extends CheckboxWrapperProps<T> {
  isSelected: boolean;
  onChange: (isSelected: boolean) => void;
}

function _Checkbox<T>(props: CheckboxProps<T>) {
  const { text, isSelected, onChange, subtitle } = props;
  const id = useId();
  const ref = React.useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(
    {
      elementType: 'button',
      onPress: () => {
        onChange(!isSelected);
      },
    },
    ref,
  );
  return (
    <button
      {...buttonProps}
      ref={ref}
      className="flex flex-row gap-2 cursor-pointer w-full duration-250 transition items-center hover:bg-hover py-1 px-4 focus:outline focus:outline-2 focus:outline-primary/[.3]"
    >
      <Checkbox isSelected={isSelected} onChange={onChange} />
      {subtitle ? (
        <div className="select-none flex flex-row gap-2 items-center">
          <Text>{text}</Text>
          <Text variant="sm-label" color="text-secondary">
            {subtitle}
          </Text>
        </div>
      ) : (
        <Text className="select-none" htmlFor={id}>
          {text}
        </Text>
      )}
    </button>
  );
}

const MemoizedCheckbox = React.memo(_Checkbox);

interface CheckboxWrapperProps<T> {
  value: T;
  text?: string;
  subtitle?: string;
}

export default function CheckboxWrapper<T>(props: CheckboxWrapperProps<T>) {
  const { value, text, subtitle } = props;
  const selected = useFilterSelectedContext() as T[];
  const mapped = useFilterMappedContext() as ((val: T) => unknown) | undefined;
  const onChange = useFilterOnChangeContext() as (val: T[]) => void;
  const handleOnChange = React.useCallback(
    (isSelected: boolean) => {
      if (isSelected) onChange([...selected, value]);
      else
        onChange(
          selected.filter((x) => {
            if (mapped) return mapped(x) !== mapped(value);
            return x !== value;
          }),
        );
    },
    [onChange, selected, value, mapped],
  );
  const uniq = useFilterUniqContext();
  return (
    <MemoizedCheckbox
      value={value}
      isSelected={uniq.has(mapped ? mapped(value) : value)}
      text={text}
      subtitle={subtitle}
      onChange={handleOnChange}
    />
  );
}
