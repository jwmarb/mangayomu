import {
  useFilterOnChangeContext,
  useFilterSelectedContext,
} from '@app/components/Filter/filter';
import Text from '@app/components/Text';
import React from 'react';
import { useButton } from 'react-aria';
import { MdCheck } from 'react-icons/md';

interface SelectProps<T> {
  value: T;
  isSelected: boolean;
  text?: string;
}

function Select<T>(props: SelectProps<T>) {
  const { value, text, isSelected } = props;
  const onChange = useFilterOnChangeContext() as (val: T) => void;
  const ref = React.useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(
    {
      onPress: () => {
        onChange(value);
      },
    },
    ref,
  );

  return (
    <button
      {...(buttonProps as React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >)}
      ref={ref}
      className="hover:bg-hover w-full p-3 active:bg-pressed transition duration-250 flex gap-2 items-center"
    >
      {!isSelected ? (
        <MdCheck className="text-variant-body text-primary opacity-0" />
      ) : (
        <MdCheck className="text-variant-body text-primary" />
      )}
      <Text color={isSelected ? 'primary' : 'text-secondary'}>
        {text ?? (typeof value === 'string' ? value : '"text" prop required')}
      </Text>
    </button>
  );
}

const MemoizedSelect = React.memo(Select);

interface SelectWrapperProps<T> {
  value: T;
  text?: string;
}

export default function SelectWrapper<T>(props: SelectWrapperProps<T>) {
  const selected = useFilterSelectedContext();

  return (
    <MemoizedSelect
      value={props.value}
      isSelected={props.value === selected}
      text={props.text}
    />
  );
}
