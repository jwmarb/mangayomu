import { Container } from '@components/Container';
import { FlexProps } from '@components/Flex/Flex.interfaces';
import { ViewProps, View, Dimensions } from 'react-native';
import { ThemedStyledProps } from 'styled-components';
import styled, { css, DefaultTheme } from 'styled-components/native';
const generateStyles = (
  props: ThemedStyledProps<ViewProps & React.RefAttributes<View> & Partial<FlexProps>, DefaultTheme>
) => css`
  ${() => {
    if (props.wrap) {
      switch (typeof props.wrap) {
        case 'string':
          return css`
            flex-wrap: ${props.wrap};
          `;
        default:
        case 'boolean':
          return css`
            flex-wrap: wrap;
          `;
      }
    }
  }}
  ${() =>
    props.fullWidth &&
    css`
      width: 100%;
    `}

    ${() =>
    props.fullHeight &&
    css`
      height: 100%;
    `}
  ${() =>
    props.debug
      ? css`
          background-color: red;
        `
      : ''}
    ${() => {
    if (props.grow)
      return css`
        flex-grow: 1;
      `;
    if (props.shrink)
      return css`
        flex-shrink: 1;
      `;

    return css`
      display: flex;
    `;
  }}
    flex-direction: ${props.direction ?? 'row'};
  align-items: ${props.alignItems ?? 'stretch'};
  justify-content: ${props.justifyContent ?? 'flex-start'};
  ${() => {
    if (props.grow && props.growMax)
      switch (props.direction) {
        case 'row':
        case 'row-reverse':
          return css`
            max-width: ${props.growMax};
          `;
        case 'column-reverse':
        case 'column':
          return css`
            max-height: ${props.growMax};
          `;
      }
  }}
`;

export const FlexBase = styled.View<Partial<FlexProps>>`
  ${generateStyles}
`;

export const FlexContainerBase = styled(Container)<Partial<FlexProps>>`
  ${generateStyles as any}
`;
