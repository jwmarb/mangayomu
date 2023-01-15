import React from 'react';
import {HomeProps} from './Home.interfaces';
import {View, Text} from 'react-native';

const Home: React.FC<HomeProps> = () => {
  return (
    <View>
      <Text>Home Screen</Text>
    </View>
  );
};

export default Home;
