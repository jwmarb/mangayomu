import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';

export const AnimatedDownloadingChapterBar = styled(Animated.View)`
  ${(props) => css`
    height: 4px;
    background-color: ${props.theme.palette.primary.main.get()};
  `}
`;

export const EmptyDownloadingChapterBar = styled.View`
  ${(props) => css`
    background-color: ${props.theme.palette.primary.main.toDisabled().get()};
    height: 4px;
    width: 100%;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  `}
`;
