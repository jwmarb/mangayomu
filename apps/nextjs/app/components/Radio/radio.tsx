import React from 'react';
import {
  useRadioContext,
  useRadioOnChangeContext,
} from '@app/components/Radio/group';
import Text from '@app/components/Text';
import useClassName, { OverrideClassName } from '@app/hooks/useClassName';

interface RadioProps<T> extends RadioWrapperProps<T> {
  isSelected: boolean;
}

interface RadioWrapperProps<T> extends OverrideClassName {
  value: T;
  label?: string;
}

export type RadioMethods = {
  toggle: () => void;
};

function _Radio<T>(
  props: RadioProps<T>,
  ref: React.ForwardedRef<RadioMethods>,
) {
  const { isSelected, value, label } = props;
  const onChange = useRadioOnChangeContext();
  const id = React.useId();
  const toggle = () => onChange(value);
  React.useImperativeHandle(ref, () => ({
    toggle,
  }));
  const className = useClassName(
    `transition duration-150 border-2 w-6 h-6 ${
      isSelected ? 'border-primary' : 'border-default'
    } rounded-full flex items-center justify-center`,
    props,
  );

  return (
    <div className="flex flex-row items-center gap-2">
      <button id={id} onClick={toggle} className={className}>
        <span
          className={
            'transition duration-150 w-3 h-3 rounded-full bg-primary' +
            (isSelected ? ' opacity-100' : ' opacity-0')
          }
        />
      </button>
      <Text component="label" htmlFor={id}>
        {label || JSON.stringify(value)}
      </Text>
    </div>
  );
}

const Radio = React.memo(React.forwardRef(_Radio));

function RadioWrapper<T>(
  props: RadioWrapperProps<T>,
  ref: React.ForwardedRef<RadioMethods>,
) {
  const { value, label } = props;
  const selected = useRadioContext() as T;
  return (
    <Radio
      ref={ref}
      isSelected={selected === value}
      value={value}
      label={label}
    />
  );
}

export default React.forwardRef(RadioWrapper);
