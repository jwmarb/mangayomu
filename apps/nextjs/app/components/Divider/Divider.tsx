import React from 'react';
import { DividerProps } from './index';
import useClassName from '@app/hooks/useClassName';

export default function Divider(props: DividerProps) {
  const { orientation = 'horizontal' } = props;
  const className = useClassName(
    orientation === 'horizontal'
      ? 'h-0.5 w-full bg-border'
      : 'h-full w-0.5 bg-border',
    props,
  );
  return <div className={className} />;
}
