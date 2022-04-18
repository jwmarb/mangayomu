import { Screen, Container, Typography, IconButton, Icon } from '@components/core';
import React from 'react';
import { UseCollapsibleOptions } from 'react-navigation-collapsible';

const MangaLibrary: React.FC = (props) => {
  const {} = props;

  const options: UseCollapsibleOptions = {
    navigationOptions: {
      headerRight: () => <IconButton icon={<Icon bundle='Feather' name='search' />} />,
    },
  };

  return (
    <Screen scrollable={options}>
      <Container>
        <Typography>Hello World</Typography>
      </Container>
    </Screen>
  );
};

export default MangaLibrary;
