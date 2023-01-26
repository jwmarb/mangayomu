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
      'align-items': alignItems = 'stretch',
      'align-self': alignSelf = 'stretch',
      'background-color': bgColor,
      'box-shadow': boxShadow,
      'justify-content': justifyContent = 'flex-start',
      'flex-grow': flexGrow,
      'flex-shrink': flexShrink,
      'flex-wrap': flexWrap,
      'flex-direction': flexDirection,
      p,
      m,
      px,
      py,
      mx,
      my,
      ml,
      mr,
      mb,
      mt,
      pl,
      pr,
      pt,
      pb,
      width = 'auto',
      height = 'auto',
      debug,
      maxWidth,
      maxHeight,
      position,
      left,
      right,
      top,
      bottom,
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
      ${implementDimensionsModel({ width, height, maxHeight, maxWidth })};
      ${implementPositionModel({ position, left, right, top, bottom })};
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
      ${implementBoxModel(theme, {
        p,
        pb,
        pl,
        pr,
        pt,
        py,
        px,
        m,
        mb,
        ml,
        mr,
        mt,
        my,
        mx,
      })};
      ${implementFlexBoxModel(theme, {
        'align-items': alignItems,
        'align-self': alignSelf,
        'flex-direction': flexDirection,
        'flex-grow': flexGrow,
        'flex-shrink': flexShrink,
        'flex-wrap': flexWrap,
        'justify-content': justifyContent,
      })}
    `;
  }}
`;

export default Box;
