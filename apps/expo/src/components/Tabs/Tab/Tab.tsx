import Flex from '@components/Flex';
import React from 'react';
import { TabsContext } from '../Tabs.context';
import { TabProps } from './Tab.interfaces';

const Tab: React.FC<TabProps> = (props) => {
  const { name, children } = props;
  const setTabs = React.useContext(TabsContext);

  React.useEffect(() => {
    setTabs((list) => list.add(name));
  }, []);

  return <>{children}</>;
};

export default Tab;
