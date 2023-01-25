import Box from '@components/Box';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StatusBar } from 'react-native';

const Container: React.FC<React.PropsWithChildren> = (props) => {
  const theme = useTheme();

  return (
    <Box
      {...props}
      pt={StatusBar.currentHeight ?? 0}
      background-color={theme.palette.background.default}
    />
  );
};

const TabHeader: React.FC<BottomTabHeaderProps> = (props) => {
  const {
    route,
    options: { headerTitle = route.name },
    navigation,
  } = props;
  return (
    <Container>
      <Box mx="s" my="m">
        <Text variant="header" bold align="center">
          {headerTitle as string}
        </Text>
      </Box>
    </Container>
  );
};

export default TabHeader;
