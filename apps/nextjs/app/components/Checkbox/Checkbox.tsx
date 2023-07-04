import React from 'react';
import type { CheckboxProps } from './Checkbox.interfaces';
import { VisuallyHidden, useCheckbox, useFocusRing } from 'react-aria';
import { useToggleState } from 'react-stately';
import { MdCheck } from 'react-icons/md';

export default function Checkbox(props: CheckboxProps) {
  const ref = React.useRef<HTMLInputElement>(null);
  const state = useToggleState();
  const { isFocusVisible, focusProps } = useFocusRing();
  const { inputProps } = useCheckbox(props, state, ref);
  const isSelected = state.isSelected && !props.isIndeterminate;
  return (
    <label>
      <VisuallyHidden>
        <input
          {...(inputProps as React.HTMLProps<HTMLInputElement>)}
          {...(focusProps as React.HTMLProps<HTMLInputElement>)}
          ref={ref}
          type="checkbox"
        />
      </VisuallyHidden>
      <div
        className={`select-none w-10 h-10 rounded-full transition duration-250 cursor-pointer flex items-center justify-center ${
          isSelected
            ? 'hover:bg-primary/[.18] active:bg-primary/[.35] focus:bg-primary/[.18]'
            : 'hover:bg-hover active:bg-pressed focus:bg-pressed'
        } ${
          isFocusVisible ? (isSelected ? 'bg-primary/[.18]' : 'bg-hover') : ''
        }`}
      >
        <div
          className={`w-4 h-4 rounded flex items-center justify-center ${
            isSelected
              ? 'ring-2 ring-primary bg-primary'
              : 'outline outline-2 outline-default'
          }`}
        >
          {isSelected && (
            <MdCheck className="text-primary-contrast text-variant-body" />
          )}
        </div>
      </div>
    </label>
  );
}
