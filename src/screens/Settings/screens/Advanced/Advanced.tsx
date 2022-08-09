import { ListItem, Switch } from '@components/core';
import List from '@components/List';
import connector, { ConnectedAdvancedProps } from './Advanced.redux';

import React from 'react';
import ItemToggle from '@screens/Settings/screens/components/ItemToggle';

const Advanced: React.FC<ConnectedAdvancedProps> = (props) => {
  const { useRecyclerListView, toggleAdvancedSetting, debugging, simulateNewChapters } = props;
  const toggleRecyclerListView = React.useCallback(() => {
    toggleAdvancedSetting('useRecyclerListView');
  }, [toggleAdvancedSetting]);
  const toggleDebugging = React.useCallback(() => {
    toggleAdvancedSetting('enableDebugging');
  }, [toggleAdvancedSetting]);
  return (
    <List>
      <ListItem
        title='Use RecyclerListView'
        subtitle='By default, MangaYomu uses FlatList to display lists of mangas on the screen. FlatList itself is very stable compared to RecyclerListView, however, it is not very performant with very large lists.'
        adornmentPlacement='right'
        onPress={toggleRecyclerListView}
        adornment={<Switch enabled={useRecyclerListView} onChange={toggleRecyclerListView} />}
      />
      <ListItem
        title='Enable debugging'
        adornmentPlacement='right'
        onPress={toggleDebugging}
        adornment={<Switch enabled={debugging} onChange={toggleDebugging} />}
      />
      {/* <ListItem title='SImulate new chapters' onPress={simulateNewChapters} /> */}
    </List>
  );
};

export default connector(Advanced);
