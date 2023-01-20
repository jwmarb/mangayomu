import Box from '@components/Box';
import Text from '@components/Text';
import React from 'react';
import { ScrollView } from 'react-native';

const Welcome: React.FC = () => {
  return (
    <ScrollView
      horizontal
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      pagingEnabled
    >
      <Box></Box>
    </ScrollView>
  );
};

export default Welcome;
