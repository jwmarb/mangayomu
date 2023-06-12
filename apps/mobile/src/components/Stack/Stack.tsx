import {
  implementBorderModel,
  implementBoxModel,
  implementDimensionsModel,
  implementFlexBoxModel,
  implementPositionModel,
  setWithPalette,
} from '@components/Box/Box.helpers';
import { StackProps } from '@components/Stack/Stack.interfaces';
import styled, { css } from '@emotion/native';
import Animated from 'react-native-reanimated';

const Stack = styled.View<StackProps>`
  ${(props) => {
    const { theme, space, debug, 'background-color': backgroundColor } = props;
    return css`
      ${(() => {
        if (space == null) return;
        switch (typeof space) {
          case 'string':
            return css`
              row-gap: ${theme.helpers.spacing(space) + 'px'};
              column-gap: ${theme.helpers.spacing(space) + 'px'};
            `;
          case 'number':
            return css`
              row-gap: ${space + 'px'};
              column-gap: ${space + 'px'};
            `;
        }
      })()};
      ${(() => {
        if (typeof space === 'object') {
          const { x, y } = space;
          return css`
            row-gap: ${() => {
              if (y == null) return '0px';
              switch (typeof y) {
                case 'string':
                  return theme.helpers.spacing(y) + 'px';
                case 'number':
                  return y + 'px';
              }
            }};
            column-gap: ${() => {
              if (x == null) return '0px';
              switch (typeof x) {
                case 'string':
                  return theme.helpers.spacing(x) + 'px';
                case 'number':
                  return x + 'px';
              }
            }};
          `;
        }
      })()};
      ${backgroundColor &&
      `
        background-color: ${setWithPalette(
          theme,
          'background-color',
          backgroundColor,
        )};
      `}
      ${debug &&
      css`
        background-color: red;
      `};
      ${implementDimensionsModel(props)};
      ${implementPositionModel(props)};
      ${implementBoxModel(theme, props)};
      ${implementFlexBoxModel(props)}
      ${implementBorderModel(theme, props)};
    `;
  }}
`;

export const AnimatedStack = Animated.createAnimatedComponent(Stack);

export default Stack;
