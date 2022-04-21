import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');

export const TabButtonContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(2, 2.4)};
  `}
`;

export const TabContainer = styled(Animated.View)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
`;

export const TabContentContainer = styled.View`
  width: ${width}px;
`;

export const TabSelectedIndicator = styled(Animated.View)<{ numOfChildren: number }>`
  ${(props) => css`
    background-color: ${props.theme.palette.primary.main.get()};
    height: 2px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: ${width / props.numOfChildren}px;
  `}
`;
