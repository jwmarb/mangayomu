import createContext from '@app/helpers/createContext';
import React, { useId } from 'react';
import { Freeze } from 'react-freeze';

export const [TabPanelContext, useTabPanel] = createContext<TabPanelProps>();

interface TabPanelProps {
  active: string | null;
  setPanels: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function TabPanel(props: React.PropsWithChildren) {
  const { children } = props;
  const { active, setPanels } = useTabPanel();
  const id = useId();
  React.useLayoutEffect(() => {
    setPanels((prev) => [...prev, id]);
  }, [id, setPanels]);
  return <Freeze freeze={active !== id}>{children}</Freeze>;
}
