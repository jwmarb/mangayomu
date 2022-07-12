import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';

export const AnimatedDownloadingChapterBar = styled(Animated.View)`
  ${(props) => css`
    height: 2px;
    background-color: ${props.theme.palette.primary.main.get()};
  `}
`;
