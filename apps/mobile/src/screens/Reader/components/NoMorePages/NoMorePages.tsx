import Box from '@components/Box';
import Text from '@components/Text';
import React from 'react';
import { useWindowDimensions } from 'react-native';

const NoMorePages: React.FC = () => {
  const { width, height } = useWindowDimensions();
  return (
    <Box
      width={width}
      height={height}
      justify-content="center"
      align-items="center"
      px="m"
      py="s"
    >
      <Text>You have reached the end of the final chapter.</Text>
    </Box>
  );
};

export default React.memo(NoMorePages);
