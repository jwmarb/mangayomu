import {
  implementBoxModel,
  implementDimensionsModel,
  implementFlexBoxModel,
  implementPositionModel,
} from '@components/Box/Box.helpers';
import { StackProps } from '@components/Stack/Stack.interfaces';
import styled, { css } from '@emotion/native';

const Stack = styled.View<StackProps>`
  ${(props) => {
    const {
      theme,
      space,
      p,
      m,
      pb,
      pl,
      pr,
      pt,
      px,
      py,
      mb,
      ml,
      mr,
      my,
      mt,
      mx,
      'align-items': alignItems,
      'align-self': alignSelf,
      'justify-content': justifyContent,
      'flex-direction': flexDirection,
      'flex-grow': flexGrow,
      'flex-shrink': flexShrink,
      'flex-wrap': flexWrap,
    } = props;
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
      })()}
      ${implementDimensionsModel(props)};
      ${implementPositionModel(props)};
      ${implementBoxModel(theme, {
        p,
        pb,
        pl,
        pr,
        py,
        px,
        pt,
        m,
        mb,
        ml,
        mr,
        my,
        mt,
        mx,
      })};
      ${implementFlexBoxModel(theme, {
        'flex-direction': flexDirection,
        'flex-grow': flexGrow,
        'flex-shrink': flexShrink,
        'flex-wrap': flexWrap,
        'justify-content': justifyContent,
        'align-items': alignItems,
        'align-self': alignSelf,
      })}
    `;
  }}
`;

export default Stack;
