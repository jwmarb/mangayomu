import Box from '@components/Box';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import React from 'react';
import { SafeAreaView, ScrollView, useWindowDimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

const Welcome: React.FC = () => {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  return (
    <ScrollView
      style={{
        backgroundColor: theme.palette.background.default,
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      horizontal
      pagingEnabled
    >
      <Box align-items="center" width={width} mt="xl">
        <Box align-self="center" maxWidth={moderateScale(350)}>
          <Text align="center" bold variant="header">
            Welcome to MangaYomu
          </Text>
          <Text align="center">Discover and read manga for free</Text>
        </Box>
      </Box>
      <Box align-items="center" width={width}>
        <Box align-self="center" maxWidth={moderateScale(350)}>
          <Text align="center" bold variant="header">
            Read anywhere, regardless of device
          </Text>
          <Text align="center">
            MangaYomu is also available in the browser, meaning you can read
            where you left off
          </Text>
        </Box>
      </Box>
    </ScrollView>
  );
};

export default Welcome;
