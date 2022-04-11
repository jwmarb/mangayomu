import { ViewProps, View } from 'react-native';
import { ThemedStyledProps } from 'styled-components';
import styled, { css, DefaultTheme } from 'styled-components/native';

function generateCSS<Component, Props>(props: ThemedStyledProps<Props & React.RefAttributes<Component>, DefaultTheme>) {
  return css`
    min-height: 100%;
    flex: 1;
    ${(props) => css`
      padding: ${props.theme.spacing(0, 2)};
    `}
  `;
}

export const Screen = styled.View`
  ${generateCSS}
`;

export const ScrollableScreen = styled.ScrollView`
  ${generateCSS}
`;
