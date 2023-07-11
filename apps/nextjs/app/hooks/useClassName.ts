/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

export type OverrideClassName = {
  /**
   * Overrides the default className that styles the component
   */
  overrideClassName?: string;
  className?: string;
};

export default function useClassName(
  className: string | (() => string),
  props: OverrideClassName,
) {
  return (
    props.overrideClassName != null
      ? [props.overrideClassName, props.className]
      : [
          typeof className === 'string' ? className : className(),
          props.className,
        ]
  )
    .filter(Boolean)
    .join(' ');
}
