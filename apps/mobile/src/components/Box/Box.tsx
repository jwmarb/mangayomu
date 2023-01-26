import styled, { css } from '@emotion/native';
import { BackgroundColor, ButtonColors } from '@mangayomu/theme';
import { BoxProps } from './Box.interfaces';
import {
  implementBoxModel,
  implementDimensionsModel,
  implementFlexBoxModel,
  implementPositionModel,
  set,
  setu,
  setwandh,
  setWithPalette,
} from './Box.helpers';

/**
 * Box is an abstract component for building layouts. All MangaYomu components are built upon this component.
 * @component
 */
const Box = styled.View<BoxProps>`
  ${(props) => {
    const {
      theme,
      'background-color': bgColor,
      'box-shadow': boxShadow,
      debug,
      'border-radius': borderRadius = 0,
      'z-index': zIndex = 0,
      'border-color': borderColor,
      'border-width': borderWidth,
      overflow,
    } = props;

    return css`
      ${boxShadow && theme.style.shadow};
      z-index: ${zIndex};
      ${(() => {
        if (debug)
          return css`
            background-color: red;
          `;
        return setWithPalette(theme, 'background-color', bgColor);
      })()}
      ${setWithPalette(theme, 'border-color', borderColor)};
      ${setu(theme, 'border-width', borderWidth)}
      ${implementDimensionsModel(props)};
      ${implementPositionModel(props)};
      ${boxShadow && theme.style.shadow};
      ${set('overflow', overflow)};
      ${(() => {
        if (borderRadius === '@theme')
          return 'border-radius: ' + theme.style.borderRadius + 'px';
        if (typeof borderRadius === 'number')
          return 'border-radius: ' + borderRadius + 'px';
        if (typeof borderRadius === 'object')
          return css`
            border-top-left-radius: ${typeof borderRadius.tl === 'number'
              ? borderRadius.tl + 'px'
              : borderRadius.tl == null
              ? '0px'
              : theme.style.borderRadius + 'px'};
            border-bottom-left-radius: ${typeof borderRadius.tl === 'number'
              ? borderRadius.bl + 'px'
              : borderRadius.bl == null
              ? '0px'
              : theme.style.borderRadius + 'px'};
            border-top-right-radius: ${typeof borderRadius.tl === 'number'
              ? borderRadius.tr + 'px'
              : borderRadius.tr == null
              ? '0px'
              : theme.style.borderRadius + 'px'};
            border-bottom-right-radius: ${typeof borderRadius.tl === 'number'
              ? borderRadius.br + 'px'
              : borderRadius.br == null
              ? '0px'
              : theme.style.borderRadius + 'px'};
          `;
      })()};
      ${implementBoxModel(theme, props)};
      ${implementFlexBoxModel(props)}
    `;
  }}
`;

export default Box;
