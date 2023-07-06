import _Tabs from './tabs';
import TabPanel from './panel';
import TabList from './list';
import Tab from './tab';

const Tabs = _Tabs as typeof _Tabs & {
  Panel: typeof TabPanel;
  List: typeof TabList;
  Tab: typeof Tab;
};

Tabs.Panel = TabPanel;
Tabs.List = TabList;
Tabs.Tab = Tab;

export default Tabs;
