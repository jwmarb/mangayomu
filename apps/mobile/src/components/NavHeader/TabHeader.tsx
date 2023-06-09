import Box from '@components/Box';
import { useNavStyles } from '@components/NavHeader';
import Text from '@components/Text';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import React from 'react';

const TabHeader: React.FC<BottomTabHeaderProps> = (props) => {
  const {
    route,
    options: { headerTitle = route.name },
  } = props;
  const NavStyles = useNavStyles();

  return (
    <Box style={NavStyles.header} justify-content="center">
      <Text variant="header" bold align="center">
        {headerTitle as string}
      </Text>
    </Box>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (props: any) => <TabHeader {...props} />;
