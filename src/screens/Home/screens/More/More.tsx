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
import { useSelector } from 'react-redux';
import { AppState } from '@redux/store';
import { useTheme } from 'styled-components/native';

const More: React.FC<StackScreenProps<RootStackParamList, 'Home'>> = (props) => {
  const { navigation } = props;
  function handleOnSettings() {
    navigation.navigate('Settings');
  }
  function handleOnDownloadManager() {
    navigation.navigate('DownloadManager');
  }
  const downloading = useSelector((state: AppState) => state.downloading.metas);
  const numberOfDownloadingMangas = React.useMemo(() => Object.keys(downloading).length, [downloading]);
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
          titleSiblingComponent={
            numberOfDownloadingMangas !== 0 ? (
              <>
                <Spacer x={1} />
                <Typography color='secondary' variant='body2'>
                  ({numberOfDownloadingMangas})
                </Typography>
              </>
            ) : null
          }
          title='Download Manager'
          adornment={<Icon bundle='Feather' name='download' color='primary' size='small' />}
          onPress={handleOnDownloadManager}
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
