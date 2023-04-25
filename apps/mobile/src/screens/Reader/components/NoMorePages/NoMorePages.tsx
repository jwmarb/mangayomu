import Box from '@components/Box';
import Text from '@components/Text';
import useReaderBackgroundColor from '@hooks/useReaderBackgroundColor';
import useScreenDimensions from '@hooks/useScreenDimensions';
import React from 'react';
import connector, { ConnectedNoMorePagesProps } from './NoMorePages.redux';

const NoMorePages: React.FC<ConnectedNoMorePagesProps> = ({
  backgroundColor,
}) => {
  const { width, height } = useScreenDimensions();
  const { background, textPrimary } = useReaderBackgroundColor(backgroundColor);
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

export default connector(React.memo(NoMorePages));
