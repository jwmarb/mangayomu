import {
  useFilterOnChangeContext,
  useFilterReversedContext,
  useFilterSelectedContext,
} from '@app/components/Filter/filter';
import Text from '@app/components/Text';
import { animated, easings, useSpring } from '@react-spring/web';
import React from 'react';
import { useButton } from 'react-aria';
import { Freeze } from 'react-freeze';
import { MdArrowDownward, MdArrowUpward } from 'react-icons/md';

interface SortProps<T> {
  isSelected: boolean;
  value: T;
  text?: string;
}

function Sort<T>(props: SortProps<T>) {
  const { isSelected, value, text } = props;
  const onChange = useFilterOnChangeContext();
  const reversed = useFilterReversedContext();
  const ref = React.useRef<HTMLButtonElement>(null);
  const [{ rotate }, api] = useSpring(() => ({
    rotate: reversed ? 0 : -180,
    config: {
      duration: 150,
      easing: easings.linear,
    },
  }));
  React.useEffect(() => {
    if (reversed) api.start({ rotate: 0 });
    else api.start({ rotate: -180 });
  }, [reversed, api]);
  const { buttonProps } = useButton(
    {
      onPress: () => {
        if (!isSelected) onChange(value, reversed);
        else onChange(value, !reversed);
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
      className="hover:bg-hover w-full p-3 active:bg-pressed transition duration-250 flex gap-2 items-center outline-none"
    >
      <Freeze
        freeze={!isSelected}
        placeholder={
          <MdArrowUpward className="text-variant-body text-primary opacity-0" />
        }
      >
        <animated.div style={{ rotate: rotate.to((val) => `${val}deg`) }}>
          <MdArrowDownward className="text-variant-body text-primary" />
        </animated.div>
      </Freeze>
      <Text color={isSelected ? 'primary' : 'text-secondary'}>
        {text ?? (typeof value === 'string' ? value : '"text" prop required')}
      </Text>
    </button>
  );
}

interface WrappedSortProps<T> {
  value: T;
  text?: string;
}

const MemoizedSort = React.memo(Sort);

export default function WrappedSort<T>(props: WrappedSortProps<T>) {
  const { value, text } = props;
  const selected = useFilterSelectedContext();

  return (
    <MemoizedSort isSelected={selected === value} value={value} text={text} />
  );
}
