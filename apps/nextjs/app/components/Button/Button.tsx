'use client';
import React from 'react';
import { useButton } from 'react-aria';
import { ButtonProps } from './Button.interfaces';
import useClassName from '@app/hooks/useClassName';
import { ButtonColor, ButtonVariant } from '@app/theme';

const buttonConfig: Record<ButtonColor, Record<ButtonVariant, string>> = {
  primary: {
    contained:
      'shadow-lg shadow-primary/[.2] text-primary-contrast bg-primary hover:bg-primary/[.66] focus:ring-primary/[0.3] outline-none focus:ring-4',
    text: 'text-primary hover:bg-primary/[.18] focus:bg-primary/[.18] focus:ring-2 outline-none',
    outline:
      'text-primary dark:hover:outline-primary dark:hover:outline-primary focus:bg-primary/[.18] dark:focus:bg-primary/[.4] active:bg-primary/[0.2] focus:ring-primary/[.2] outline outline-2 dark:outline-primary/[.7] outline-primary focus:outline-primary/[.5] focus:ring-4',
  },
  secondary: {
    contained:
      'shadow-lg shadow-secondary/[.2] text-secondary-contrast bg-secondary hover:bg-secondary/[.66] focus:ring-secondary/[0.5] outline-none focus:ring-4',
    text: 'text-secondary hover:bg-secondary/[.18] focus:bg-secondary/[.18] focus:ring-2 outline-none',
    outline:
      'text-secondary dark:hover:outline-secondary dark:hover:outline-secondary focus:bg-secondary/[.18] dark:focus:bg-secondary/[.4] active:bg-secondary/[0.2] focus:ring-secondary/[.2] outline outline-2 dark:outline-secondary/[.7] outline-secondary focus:outline-secondary/[.5] focus:ring-4',
  },
};

const disabledConfig: Record<ButtonVariant, string> = {
  contained: 'shadow-lg shadow-disabled/[.2] text-hint bg-disabled',
  text: 'text-hint',
  outline: 'text-hint outline outline-2 outline-disabled',
};

export default function Button(props: ButtonProps) {
  const {
    children,
    color = 'primary',
    disabled,
    variant = 'text',
    icon,
    iconPlacement = 'left',
  } = props;
  const ref = React.useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(
    { ...props, isDisabled: disabled, elementType: 'button' },
    ref,
  );
  const className = useClassName(
    `select-none px-4 py-2 rounded-lg text-variant-button transition ease-out hover:duration-250 duration-250 motion-reduce:transition-none motion-reduce:hover:transition-none flex flex-row items-center justify-center gap-2 ${
      disabled ? disabledConfig[variant] : buttonConfig[color][variant]
    }`,
    props,
  );
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <button {...(buttonProps as any)} className={className} ref={ref}>
      {icon && iconPlacement === 'left' && <div>{icon}</div>}
      {children}
      {icon && iconPlacement === 'right' && <div>{icon}</div>}
    </button>
  );
}
