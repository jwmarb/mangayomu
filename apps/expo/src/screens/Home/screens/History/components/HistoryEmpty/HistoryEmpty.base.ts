import Animated, { FadeIn } from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';

export const HistoryEmptyContainer = styled(Animated.View).attrs({ entering: FadeIn })`
  ${(props) => css`
    padding: ${props.theme.spacing(3)};
    flex-grow: 1;
    justify-content: center;
    align-items: center;
  `}
`;
