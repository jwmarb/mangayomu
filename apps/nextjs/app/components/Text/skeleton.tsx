import useClassName, { OverrideClassName } from '@app/hooks/useClassName';
import Text from './Text';
import React from 'react';
import { TextComponentType, TextProps } from '@app/components/Text';

interface SkeletonProps<T extends TextComponentType>
  extends OverrideClassName,
    TextProps<T> {
  numberOfLines?: number;
  classNames?: string[];
}

export default function Skeleton<T extends TextComponentType>(
  props: SkeletonProps<T>,
) {
  const { className: _, numberOfLines = 1, classNames = [], ...rest } = props;
  const className = useClassName(
    'skeleton rounded-full inline absolute left-0 right-0 bottom-0 top-0 h-[50%] my-auto',
    props,
  );
  return (
    <div className="flex flex-col flex-grow w-full">
      {new Array(numberOfLines).fill('placeholder').map((x, i) => (
        <Text
          component="span"
          key={i}
          {...rest}
          className={[classNames[i], 'relative'].join(' ')}
        >
          <Text component="span" {...rest} className="opacity-0">
            {x}
          </Text>
          <div className={className} />
        </Text>
      ))}
    </div>
  );
}
