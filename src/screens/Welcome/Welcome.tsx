import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import { Screen, Typography } from '@components/core';
import React from 'react';

const WelcomeScreen: React.FC<StackScreenProps<RootStackParamList, 'Welcome'>> = ({ route, navigation }) => {
  return (
    <Screen>
      <Typography>Hello World</Typography>
    </Screen>
  );
};

export default WelcomeScreen;
