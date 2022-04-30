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
        <ListItem title='About' adornment={<Icon bundle='Feather' name='info' color='primary' size='small' />} />
        <ListItem
          adornment={<Icon bundle='MaterialCommunityIcons' name='heart-outline' color='secondary' />}
          title='Love the app?'
          subtitle='Show some love by donating!'
        />
      </List>
    </Screen>
  );
};

export default More;
