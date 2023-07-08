'use client';
import useClassName from '@app/hooks/useClassName';
import React from 'react';
import { useButton } from 'react-aria';
import type { IconButtonProps } from './';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function IconButton(
  props: React.PropsWithChildren<IconButtonProps>,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { icon } = props;
  const internalRef = React.useRef<HTMLButtonElement>(null);
  const ref = internalRef || forwardedRef;
  const className = useClassName(
    'w-10 h-10 transition duration-250 hover:bg-hover focus:bg-hover active:bg-pressed outline-none rounded-full flex items-center justify-center',
    props,
  );
  const { buttonProps } = useButton({ ...props, elementType: 'button' }, ref);
  return (
    <button
      {...(buttonProps as React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >)}
      ref={ref}
      className={className}
    >
      {React.cloneElement(icon, {
        className: 'w-5 h-5 text-text-secondary',
      })}
    </button>
  );
}

export default React.forwardRef(IconButton);
