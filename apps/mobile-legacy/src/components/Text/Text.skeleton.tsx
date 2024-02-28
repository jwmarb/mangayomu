import Box, { BoxProps } from '@components/Box';
import { coverStyles } from '@components/Cover/Cover';
import Text from './Text';
import React from 'react';

interface TextSkeletonProps extends BoxProps {
  numberOfLines?: number;
  lineStyles?: BoxProps[];
}

const TextSkeleton: React.FC<TextSkeletonProps> = (props) => {
  const { numberOfLines = 1, lineStyles = [], ...rest } = props;
  return (
    <Box {...rest}>
      {new Array(numberOfLines).fill('').map((_, i) => (
        <Box key={i} {...lineStyles[i]}>
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
