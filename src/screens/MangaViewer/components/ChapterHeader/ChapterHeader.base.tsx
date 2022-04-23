import { Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';
const { width } = Dimensions.get('window');
const halfWidth = width / 2;
export const ChapterHeaderContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(1, 3)};
    background-color: ${props.theme.palette.background.default.get()};
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
  `}
`;

export const ChapterLoadingIndicator = styled(Animated.View)`
  ${(props) => css`
    background-color: ${props.theme.palette.primary.main.get()};
    height: 2px;
    width: ${halfWidth}px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  `}
`;

export const ChapterLoadingIndicatorBackground = styled(Animated.View)`
  ${(props) => css`
    background-color: ${props.theme.palette.primary[props.theme.palette.mode ?? 'light'].get()};
    height: 2px;
    width: ${width}px;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  `}
`;
