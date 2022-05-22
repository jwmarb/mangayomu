import { ChapterContainer } from '@components/Chapter/Chapter.base';
import Flex from '@components/Flex';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Progress from '@components/Progress';
import Spacer from '@components/Spacer';
import { Typography, TypographySkeleton } from '@components/Typography';
import useAnimatedLoading from '@hooks/useAnimatedLoading';
import React from 'react';
import { View } from 'react-native';
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
        <View>
          <Progress color='disabled' />
          <Spacer x={5} />
        </View>
      </Flex>
    </ChapterContainer>
  );
};

export default ChapterSkeleton;
