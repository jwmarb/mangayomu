import Box from '@components/Box';
import Text from '@components/Text';
import useReaderBackgroundColor from '@hooks/useReaderBackgroundColor';
import useScreenDimensions from '@hooks/useScreenDimensions';
import React from 'react';

const NoMorePages: React.FC = () => {
  const { width, height } = useScreenDimensions();
  const { background, textPrimary } = useReaderBackgroundColor();
  return (
    <Box
      background-color={background}
      width={width}
      height={height}
      justify-content="center"
      align-items="center"
      px="m"
      py="s"
    >
      <Text color={textPrimary}>
        You have reached the end of the final chapter.
      </Text>
    </Box>
  );
};

export default React.memo(NoMorePages);
