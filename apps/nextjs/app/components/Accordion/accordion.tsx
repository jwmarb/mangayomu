import Text from '@app/components/Text';
import { AccordionProps } from './';
import React from 'react';
import { Freeze } from 'react-freeze';
import useClassName from '@app/hooks/useClassName';
import { MdChevronRight } from 'react-icons/md';
import { animated, easings, useSpring } from '@react-spring/web';
import useBoolean from '@app/hooks/useBoolean';
import { useButton } from 'react-aria';

export default function Accordion(props: AccordionProps) {
  const { children, title, defaultOpened } = props;
  const [active, toggle] = useBoolean(defaultOpened);
  const [{ rotate }, api] = useSpring(() => ({
    rotate: defaultOpened ? 90 : -90,
    config: {
      duration: 150,
      easing: easings.linear,
    },
  }));

  React.useEffect(() => {
    if (active) api.start({ rotate: 90 });
    else api.start({ rotate: -90 });
    return () => {
      api.stop();
    };
  }, [active, api]);

  const className = useClassName(
    'flex flex-row justify-between gap-2 w-full items-center px-4 py-3 hover:bg-hover focus:outline focus:outline-2 focus:outline-primary/[.3] transition duration-250',
    props,
  );
  const ref = React.useRef<HTMLButtonElement>(null);
  const { buttonProps } = useButton(
    {
      onPress: () => toggle(),
    },
    ref,
  );
  return (
    <div>
      <button {...buttonProps} ref={ref} className={className}>
        <Text className="font-medium">{title}</Text>
        <animated.div style={{ rotate: rotate.to((val) => `${val}deg`) }}>
          <MdChevronRight className="w-5 h-5 text-text-secondary" />
        </animated.div>
      </button>
      <Freeze freeze={!active}>{children}</Freeze>
    </div>
  );
}
