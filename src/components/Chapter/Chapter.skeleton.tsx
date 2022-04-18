import { ChapterContainer } from '@components/Chapter/Chapter.base';
import Flex from '@components/Flex';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import { Typography, TypographySkeleton } from '@components/Typography';
import useAnimatedLoading from '@hooks/useAnimatedLoading';
import React from 'react';
import Animated from 'react-native-reanimated';

const ChapterSkeleton: React.FC = (props) => {
  const {} = props;
  const style = useAnimatedLoading();
  return (
    <ChapterContainer>
      <Flex justifyContent='space-between' alignItems='center'>
        <Flex direction='column'>
          <Animated.View style={style}>
            <TypographySkeleton width={200} />
            <TypographySkeleton width={120} />
          </Animated.View>
        </Flex>
        <IconButton icon={<Icon bundle='Feather' name='download' />} disabled />
      </Flex>
    </ChapterContainer>
  );
};

export default ChapterSkeleton;
