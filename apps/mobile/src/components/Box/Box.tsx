import styled, { css } from '@emotion/native';
import { BackgroundColor, ButtonColors } from '@mangayomu/theme';
import { BoxProps } from './Box.interfaces';
import {
  implementBoxModel,
  implementFlexBoxModel,
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
      flex,
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
      ${set('position', position)};
      ${boxShadow && theme.style.shadow};
      ${maxWidth && setwandh('max-width', maxWidth)};
      ${maxHeight && setwandh('max-height', maxHeight)};
      ${set('top', top)};
      ${set('bottom', bottom)};
      ${set('left', left)};
      ${set('right', right)};
      ${setwandh('height', height)};
      ${setwandh('width', width)};
      border-radius: ${typeof borderRadius === 'number'
        ? borderRadius + 'px'
        : theme.style.borderRadius + 'px'};
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
        flex,
        'justify-content': justifyContent,
      })}
    `;
  }}
`;

export default Box;
