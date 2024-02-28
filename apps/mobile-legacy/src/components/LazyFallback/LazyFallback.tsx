import Box from '@components/Box';
import Progress from '@components/Progress';
import React from 'react';

export default function LazyFallbackBaseComponent() {
  return (
    <Box
      position="absolute"
      left={0}
      right={0}
      bottom={0}
      top={0}
      justify-content="center"
      align-items="center"
      flex-grow
    >
      <Progress />
    </Box>
  );
}
