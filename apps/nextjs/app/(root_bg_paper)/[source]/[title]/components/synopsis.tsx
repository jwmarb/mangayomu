'use client';
import Button from '@app/components/Button';
import Text from '@app/components/Text';
import useBoolean from '@app/hooks/useBoolean';
import React from 'react';
import { MdChevronRight } from 'react-icons/md';
import { animated, useSpring } from '@react-spring/web';

interface SynopsisProps {
  sanitized: string;
}

export default function Synopsis(props: SynopsisProps) {
  const { sanitized } = props;
  const divElement = React.useRef<HTMLDivElement>(null);
  const [showExpand, toggleShowExpand] = useBoolean();
  const [hidden, toggleHidden] = useBoolean();
  const [{ rotate }, api] = useSpring(() => ({
    rotate: 0,
    config: { duration: 150 },
  }));
  const numberOfLines = React.useRef<number | null>(null);
  const listener = React.useCallback(() => {
    if (divElement.current) {
      const style = window.getComputedStyle(divElement.current, null);
      const lineHeight = parseFloat(style.getPropertyValue('line-height'));
      const elHeight = divElement.current.clientHeight;
      numberOfLines.current =
        numberOfLines.current ?? Math.ceil(elHeight / lineHeight);
      toggleShowExpand(numberOfLines.current > 6);
    }
  }, [toggleShowExpand]);
  React.useLayoutEffect(() => {
    listener();
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    };
  }, [listener]);
  React.useEffect(() => {
    if (hidden) api.start({ rotate: -90 });
    else api.start({ rotate: 90 });
  }, [hidden, api]);
  return (
    <>
      <div className="mt-10 flex flex-row items-center justify-between space-x-2">
        <Text variant="header">Synopsis</Text>
        {showExpand && (
          <Button
            icon={
              <animated.div
                style={{ transform: rotate.to((val) => `rotate(${val}deg)`) }}
              >
                <MdChevronRight />
              </animated.div>
            }
            iconPlacement="right"
            onPress={() => toggleHidden()}
          >
            Expand
          </Button>
        )}
      </div>
      {sanitized ? (
        <div
          ref={divElement}
          className={`font-normal text-normal text-text-secondary leading-normal ${
            hidden ? 'line-clamp-6' : ''
          }`}
          dangerouslySetInnerHTML={{
            __html: sanitized,
          }}
        />
      ) : (
        <Text color="text-secondary" className="italic">
          No description available
        </Text>
      )}
    </>
  );
}
