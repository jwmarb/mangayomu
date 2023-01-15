import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';
import { Dimensions } from 'react-native';
import { ScreenDimension } from '@utils/extra';
import { ScrollView } from 'react-native-gesture-handler';
export const TabButtonContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(2, 2.4)};
  `}
`;

export const TabContainer = styled(Animated.View)`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  position: absolute;
  top: 0;
`;

export const TabContentContainer = styled.View<ScreenDimension>`
  ${(props) => css`
    width: ${props.width}px;
  `}
`;

export const TabSelectedIndicator = styled(Animated.View)<{ numOfChildren: number } & ScreenDimension>`
  ${(props) => css`
    background-color: ${props.theme.palette.primary.main.get()};
    height: 2px;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: ${props.width / props.numOfChildren}px;
  `}
`;
