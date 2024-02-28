import Box from '@components/Box';
import Text from '@components/Text';
import React from 'react';

const Title = React.memo(() => {
  return (
    <Box py="s">
      <Text variant="header" bold>
        Reader Cache
      </Text>
      <Text color="textSecondary">
        The reader's cache that enables it to function
      </Text>
    </Box>
  );
});

export default function ReaderCache() {
  return (
    <>
      <Title />
    </>
  );
}
