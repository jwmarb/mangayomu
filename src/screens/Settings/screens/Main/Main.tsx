import React from 'react';
import { List, Icon, ListItem, Typography, Divider, ListSection, Screen } from '@components/core';
import { StackScreenProps } from '@react-navigation/stack';
import { SettingsStackParamList } from '@navigators/Settings/Settings.interfaces';
import Reader from '@screens/Settings/screens/Reader';
import Appearance from '@screens/Settings/screens/Appearance';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import Cache from '@screens/Settings/screens/Cache';
import { MainWrapper } from '@screens/Settings/screens/Main/Main.base';

const Main: React.FC<StackScreenProps<SettingsStackParamList, 'Main'>> = (props) => {
  const { navigation } = props;
  function navigateTo(screenName: keyof SettingsStackParamList) {
    return () => {
      navigation.navigate(screenName);
    };
  }
  return (
    <ScrollView>
      <MainWrapper>
        <List>
          <ListItem adornment={<Icon bundle='Feather' name='compass' color='primary' />} title='Browse' />
          <ListItem adornment={<Icon bundle='Feather' name='code' color='primary' />} title='Advanced' />
          <Appearance />
          <Divider />
          <Reader />
          <Divider />
          <Cache />
        </List>
      </MainWrapper>
    </ScrollView>
  );
};

export default Main;
