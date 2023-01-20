import Box from '@components/Box';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import React from 'react';
import { ScrollView } from 'react-native';

const Welcome: React.FC = () => {
  const theme = useTheme();
  return (
    <ScrollView
      style={{
        backgroundColor: theme.palette.background.default,
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator
      overScrollMode="always"
      horizontal
    >
      <Box align-items="center" justify-content="center" width="100%">
        <Text bold variant="header">
          Hello World
        </Text>
        <Text>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Cumque iusto
          dignissimos error vel non voluptatem est doloribus, magnam culpa ut
          quod. Porro sint natus inventore ut fugiat eaque eos sed?
        </Text>
      </Box>
      <Box align-items="center" justify-content="center" width="100%">
        <Text bold variant="header">
          Sample Text
        </Text>
        <Text>
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Rerum odit
          cumque, dolor nulla, ullam id pariatur doloribus soluta ipsam,
          voluptatum quam vitae reprehenderit provident repellendus ex dolorum
          laborum. Labore, molestias.
        </Text>
      </Box>
    </ScrollView>
  );
};

export default Welcome;
