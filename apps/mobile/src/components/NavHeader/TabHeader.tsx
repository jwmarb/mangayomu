import Box from '@components/Box';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StatusBar } from 'react-native';

const TabHeader: React.FC<BottomTabHeaderProps> = (props) => {
  const {
    route,
    options: { headerTitle = route.name },
    navigation,
  } = props;
  const theme = useTheme();
  return (
    <Box
      pt={StatusBar.currentHeight ?? 0}
      background-color={theme.palette.background.default}
    >
      <Box mx="s" my="m">
        <Text variant="header" bold align="center">
          {headerTitle as string}
        </Text>
      </Box>
    </Box>
  );
};

export default TabHeader;
