import Box from '@components/Box';
import { coverStyles } from '@components/Cover/Cover';
import Text from '@components/Text';
import React from 'react';

interface TextSkeletonProps {
  numberOfLines?: number;
}

const TextSkeleton: React.FC<TextSkeletonProps> = (props) => {
  const { numberOfLines = 1 } = props;
  return (
    <Box>
      {new Array(numberOfLines).fill('').map((_, i) => (
        <Box key={i}>
          <Text style={coverStyles.placeholderText}>a</Text>
          <Box
            flex-grow
            position="absolute"
            left={0}
            right={0}
            top={0}
            bottom={0}
            align-items="center"
            justify-content="center"
          >
            <Box
              height="50%"
              background-color="skeleton"
              border-radius="@theme"
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

export default TextSkeleton;
