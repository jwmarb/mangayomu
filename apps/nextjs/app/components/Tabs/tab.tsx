import Text from '@app/components/Text';
import createContext from '@app/helpers/createContext';
import React from 'react';
import { Freeze } from 'react-freeze';
import { useTabs } from './tabs';
import { useTabList } from './list';

export const [TabPropsContext, useTab] = createContext<TabProps>();

interface TabProps {
  setActive: React.Dispatch<React.SetStateAction<string | null>>;
  active: string | null;
}
function Tab(props: React.PropsWithChildren) {
  const { children } = props;
  const { setActive, active } = useTab();
  const setTabPanels = useTabs();
  const { tabRefs } = useTabList();
  const [panel, setPanel] = React.useState<string>('');
  const ref = React.useRef<HTMLButtonElement>(null);

  React.useLayoutEffect(() => {
    setTabPanels((prev) => [...prev, setPanel]);
  }, [setPanel, setTabPanels]);
  React.useLayoutEffect(() => {
    tabRefs.current.push(ref);
  }, [tabRefs]);

  const isActive = active === panel;

  return (
    <button
      ref={ref}
      role="tab"
      aria-selected={isActive}
      onClick={() => {
        setActive(panel);
      }}
      className={`py-2 px-4 transition duration-250 flex-grow border-b-2 outline-none focus:bg-primary/[.3] ${
        isActive ? 'border-primary' : 'border-transparent'
      }`}
    >
      <Text color={isActive ? 'primary' : 'hint'}>{children}</Text>
    </button>
  );
}

export default React.memo(Tab);
