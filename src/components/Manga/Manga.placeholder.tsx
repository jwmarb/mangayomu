import Flex from '@components/Flex';
import MangaSkeleton from '@components/Manga/Manga.skeleton';
import withAnimatedLoading from '@utils/Animations/withAnimatedLoading';
import React from 'react';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

const placeholders = new Array(10).fill('').map((_, i) => <MangaSkeleton key={i} />);

const MangaPlaceholder: React.FC = () => {
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Flex spacing={2}>{placeholders}</Flex>
    </Animated.View>
  );
};

export default withAnimatedLoading(MangaPlaceholder);
