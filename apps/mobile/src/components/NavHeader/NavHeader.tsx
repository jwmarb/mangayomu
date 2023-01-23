import Box from '@components/Box';
import Text from '@components/Text';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import React from 'react';
import { StatusBar } from 'react-native';

const NavHeader: React.FC<NativeStackHeaderProps> = (props) => {
  const { options, route, navigation } = props;
  return (
    <Box mt={StatusBar.currentHeight ?? 0}>
      <Text>Hello WOrld</Text>
    </Box>
  );
};

export default NavHeader;
