import { Skeleton, Flex } from '@components/core';
import withAnimatedLoading from '@utils/Animations/withAnimatedLoading';
import withAnimatedMounting from '@utils/Animations/withAnimatedMounting';
import { Dimensions } from 'react-native';
import Animated, { FadeOut } from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';

export const MangaItemContainerEven = styled(Animated.View).attrs({ exiting: FadeOut })`
  ${(props) => css`
    align-items: flex-end;
    padding: ${props.theme.spacing(1)};
  `}
`;

const ListLoading = new Array(8).fill('').map((_, i) => (
  <MangaItemContainerEven key={i}>
    <Skeleton.MangaComponent />
  </MangaItemContainerEven>
));

export const MangaItemsLoading: React.FC = withAnimatedLoading(() => {
  return (
    <Flex wrap justifyContent='center'>
      {ListLoading}
    </Flex>
  );
});
