'use client';

import useBoolean from '@app/hooks/useBoolean';
import useClassName, { OverrideClassName } from '@app/hooks/useClassName';
import {
  Interpolation,
  SpringValue,
  useSpring,
  animated,
} from '@react-spring/web';
import React, { useId } from 'react';

const ListAccordionHeaderContext = React.createContext<
  readonly [SpringValue<number>, ReturnType<typeof useBoolean>[1]] | null
>(null);

export const useListAccordionHeader = () =>
  React.useContext(ListAccordionHeaderContext);
const ListAccordionContentContext = React.createContext<boolean | null>(null);

export const useListAccordionContent = () => {
  const ctx = React.useContext(ListAccordionContentContext);
  if (ctx == null)
    throw new Error(
      'Illegal use of ListAccordionContentContext. You cannot use this component unless its parent or ancestor is a List.Accordion',
    );
  return ctx;
};

export default function Accordion({
  children,
  persist = false,
}: React.PropsWithChildren<{ persist?: boolean }>) {
  const id = useId();
  const [expanded, toggle] = useBoolean(
    persist && localStorage.getItem(id) === 'true',
  );
  const [{ rotate }, api] = useSpring(() => ({
    rotate: persist && localStorage.getItem(id) === 'true' ? 0 : 90,
    config: { duration: 150 },
  }));

  React.useEffect(() => {
    if (expanded) {
      if (persist) localStorage.setItem(id, 'true');
      api.start({ rotate: 90 });
    } else {
      if (persist) localStorage.setItem(id, 'false');
      api.start({ rotate: 0 });
    }
    return () => {
      api.stop();
    };
  }, [expanded, api, id, persist]);

  const providedHeaderContextValue = React.useMemo(
    () => [rotate, toggle] as const,
    [rotate, toggle],
  );
  return (
    <ListAccordionHeaderContext.Provider value={providedHeaderContextValue}>
      <ListAccordionContentContext.Provider value={expanded}>
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
  const ctx = useListAccordionContent();
  return (
    <div
      {...rest}
      style={{
        ...style,
        height: ctx ? undefined : 0,
      }}
      className={className}
    >
      {children}
    </div>
  );
}

Accordion.Content = Content;
