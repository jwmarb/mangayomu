import pixelToNumber from '@utils/pixelToNumber';
import { ViewProps, View } from 'react-native';
import { ThemedStyledProps } from 'styled-components';
import styled, { css, DefaultTheme } from 'styled-components/native';
import { Animated } from 'react-native';

function generateCSS<Component, Props>(props: ThemedStyledProps<Props & React.RefAttributes<Component>, DefaultTheme>) {
  return css`
    ${(props) => css`
      background-color: ${props.theme.palette.background.default.get()};
      padding: ${props.theme.spacing(3, 0)};
    `}
  `;
}

export const Screen = styled.View`
  ${generateCSS}
`;

export const ScrollableScreen = styled.ScrollView`
  min-height: 100%;
  ${(props) => css`
    background-color: ${props.theme.palette.background.default.get()};
  `}
`;

export const AnimatedScrollableScreen = styled(Animated.ScrollView)`
  min-height: 100%;
  ${(props) => css`
    background-color: ${props.theme.palette.background.default.get()};
  `}
`;
