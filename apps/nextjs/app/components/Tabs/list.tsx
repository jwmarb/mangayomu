import createContext from '@app/helpers/createContext';
import React from 'react';

export const [TabListContext, useTabList] = createContext<TabListProps>();

interface TabListProps {
  tabRefs: React.MutableRefObject<React.RefObject<HTMLButtonElement>[]>;
  panels: string[];
  setActive: React.Dispatch<React.SetStateAction<string | null>>;
  active: string | null;
}

export default function TabList(props: React.PropsWithChildren) {
  const { children } = props;
  const { tabRefs, panels, setActive, active } = useTabList();
  const panelsRef = React.useRef<string[]>(panels);
  const activeRef = React.useRef<string | null>(active);
  panelsRef.current = panels;
  activeRef.current = active;

  React.useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (
        (e.key === 'ArrowRight' || e.key === 'ArrowLeft') &&
        activeRef.current
      ) {
        let tabIndex = panelsRef.current.indexOf(activeRef.current);

        if (e.key === 'ArrowRight') {
          tabIndex++;
          if (tabIndex >= tabRefs.current.length) tabIndex = 0;
        } else if (e.key === 'ArrowLeft') {
          tabIndex--;
          if (tabIndex < 0) tabIndex = tabRefs.current.length - 1;
        }
        setActive(panelsRef.current[tabIndex]);
        tabRefs.current[tabIndex].current?.focus();
      }
    };
    ref.current?.addEventListener('keydown', listener);
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      ref.current?.removeEventListener('keydown', listener);
    };
  }, [tabRefs]);
  const ref = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} role="tablist" className="flex flex-row">
      {children}
    </div>
  );
}
