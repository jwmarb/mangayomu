import Box from '@components/Box';
import Stack from '@components/Stack';
import Text from '@components/Text';
import AppearanceMode from '@screens/Appearance/components/AppearanceMode';
import React from 'react';

const InterfaceTheme: React.FC = () => {
  return (
    <Box px="m" py="s">
      <Text variant="header" bold>
        Interface theme
      </Text>
      <Text color="textSecondary">Customize your application theme</Text>
      <Stack space="s">
        <AppearanceMode />
      </Stack>
    </Box>
  );
};

export default InterfaceTheme;
