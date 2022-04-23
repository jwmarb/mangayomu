import React from 'react';
import { List, Icon, ListItem } from '@components/core';

const Main: React.FC = (props) => {
  const {} = props;
  return (
    <List>
      <ListItem adornment={<Icon bundle='MaterialCommunityIcons' name='cog' color='textSecondary' />} title='General' />
      <ListItem
        adornment={<Icon bundle='MaterialCommunityIcons' name='palette' color='textSecondary' />}
        title='Appearance'
      />
      <ListItem
        adornment={<Icon bundle='MaterialCommunityIcons' name='bell' color='textSecondary' />}
        title='Notifications'
      />
      <ListItem adornment={<Icon bundle='Feather' name='book-open' color='textSecondary' />} title='Reader' />
      <ListItem adornment={<Icon bundle='Feather' name='compass' color='textSecondary' />} title='Browse' />
      <ListItem adornment={<Icon bundle='Feather' name='code' color='textSecondary' />} title='Advanced' />
      <ListItem
        adornment={<Icon bundle='MaterialCommunityIcons' name='heart-outline' color='secondary' />}
        title='Love the app?'
        subtitle='Show some love by donating!'
      />
    </List>
  );
};

export default Main;
