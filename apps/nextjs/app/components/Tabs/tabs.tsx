import React, { KeyboardEventHandler } from 'react';
import { TabPropsContext } from './tab';
import { TabPanelContext } from './panel';
import createContext from '@app/helpers/createContext';
import { TabListContext } from '@app/components/Tabs/list';

export const [TabsContext, useTabs] =
  createContext<
    React.Dispatch<
      React.SetStateAction<React.Dispatch<React.SetStateAction<string>>[]>
    >
  >();

export default function Tabs({ children }: React.PropsWithChildren) {
  const [active, setActive] = React.useState<string | null>(null);
  const [panels, setPanels] = React.useState<string[]>([]);
  const tabRefs = React.useRef<React.RefObject<HTMLButtonElement>[]>([]);
  const [tabs, setTabs] = React.useState<
    React.Dispatch<React.SetStateAction<string>>[]
  >([]);

  React.useLayoutEffect(() => {
    return () => {
      setPanels([]);
      setTabs([]);
      tabRefs.current = [];
    };
  }, []);
  React.useLayoutEffect(() => {
    if (tabs.length === panels.length)
      for (let i = 0; i < panels.length; i++) {
        tabs[i](panels[i]);
      }
  }, [tabs, panels]);
  React.useLayoutEffect(() => {
    if (panels[0] != null) setActive(panels[0]);
  }, [panels, setActive]);

  // React.useInsertionEffect(() => {
  //   const tabs = document.querySelectorAll('[role="tab"]');
  //   const tabsList: HTMLDivElement = document.querySelector('[role="tablist"]');
  //   const listener: KeyboardEventHandler = (e) => {

  //   }
  //   tabsList?.addEventListener('keydown', listener);
  //   return () => {
  //     tabsList?.removeEventListener('keydown', listener);
  //   }
  // }, []);

  return (
    <TabListContext.Provider value={{ tabRefs, panels, setActive, active }}>
      <TabsContext.Provider value={setTabs}>
        <TabPropsContext.Provider value={{ active, setActive }}>
          <TabPanelContext.Provider value={{ active, setPanels }}>
            {children}
          </TabPanelContext.Provider>
        </TabPropsContext.Provider>
      </TabsContext.Provider>
    </TabListContext.Provider>
  );
}
