import React from 'react';
import {
  Screen,
  Flex,
  Button,
  Category,
  Typography,
  Container,
  Icon,
  Spacer,
  List,
  ListItem,
  Divider,
} from '@components/core';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '@navigators/Root/Root.interfaces';

const More: React.FC<StackScreenProps<RootStackParamList, 'Home'>> = (props) => {
  const { navigation } = props;
  function handleOnSettings() {
    navigation.navigate('Settings');
  }
  return (
    <Screen scrollable>
      <Flex direction='column' container alignItems='center' verticalPadding={0} horizontalPadding={3}>
        <Typography variant='subheader'>Account</Typography>
        <Flex>
          <Button title='Sign In' />
        </Flex>
      </Flex>
      <Spacer y={3} />
      <Divider />
      <List>
        <ListItem
          title='Settings'
          adornment={<Icon bundle='Feather' name='settings' color='primary' size='small' />}
          onPress={handleOnSettings}
        />
        <ListItem
          title='About MangaYomu'
          adornment={<Icon bundle='Feather' name='info' color='primary' size='small' />}
        />
      </List>
    </Screen>
  );
};

export default More;
