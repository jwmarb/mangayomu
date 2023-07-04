'use client';

import useBoolean from '@app/hooks/useBoolean';
import useClassName, { OverrideClassName } from '@app/hooks/useClassName';
import {
  Interpolation,
  SpringValue,
  useSpring,
  animated,
} from '@react-spring/web';
import React from 'react';

const ListAccordionHeaderContext = React.createContext<
  readonly [SpringValue<number>, ReturnType<typeof useBoolean>[1]] | null
>(null);

export const useListAccordionHeader = () =>
  React.useContext(ListAccordionHeaderContext);
const ListAccordionContentContext =
  React.createContext<SpringValue<number> | null>(null);

export const useListAccordionContent = () => {
  const ctx = React.useContext(ListAccordionContentContext);
  if (ctx == null)
    throw new Error(
      'Illegal use of ListAccordionContentContext. You cannot use this component unless its parent or ancestor is a List.Accordion',
    );
  return ctx;
};

export default function Accordion({ children }: React.PropsWithChildren) {
  const [expanded, toggle] = useBoolean();
  const [{ rotate }, api] = useSpring(() => ({
    rotate: 0,
    config: { duration: 150 },
  }));

  React.useEffect(() => {
    if (expanded) api.start({ rotate: 90 });
    else api.start({ rotate: 0 });
    return () => {
      api.stop();
    };
  }, [expanded, api]);

  const providedHeaderContextValue = React.useMemo(
    () => [rotate, toggle] as const,
    [rotate, toggle],
  );
  return (
    <ListAccordionHeaderContext.Provider value={providedHeaderContextValue}>
      <ListAccordionContentContext.Provider value={rotate}>
        {children}
      </ListAccordionContentContext.Provider>
    </ListAccordionHeaderContext.Provider>
  );
}

export function Content(
  props: React.PropsWithChildren<
    React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLDivElement>,
      HTMLDivElement
    > &
      OverrideClassName
  >,
) {
  const { style = {}, children, ...rest } = props;
  const className = useClassName('overflow-clip', props);
  const ref = React.useRef<HTMLDivElement>(null);
  const [height, setHeight] = React.useState<number | null>(null);
  React.useEffect(() => {
    if (ref.current) setHeight(ref.current.offsetHeight);
  }, []);
  const ctx = useListAccordionContent();
  return (
    <animated.div
      {...rest}
      ref={ref}
      style={{
        ...style,
        height: height ? ctx.to([0, 90], [0, height]) : undefined,
      }}
      className={className}
    >
      {children}
    </animated.div>
  );
}
