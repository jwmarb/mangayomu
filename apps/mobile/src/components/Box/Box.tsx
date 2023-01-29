import styled, { css } from '@emotion/native';
import { BackgroundColor, ButtonColors } from '@mangayomu/theme';
import { BoxProps } from './Box.interfaces';
import {
  implementBorderModel,
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
      'z-index': zIndex = 0,
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
      ${implementBorderModel(theme, props)};
      ${implementDimensionsModel(props)};
      ${implementPositionModel(props)};
      ${boxShadow && theme.style.shadow};
      ${set('overflow', overflow)};

      ${implementBoxModel(theme, props)};
      ${implementFlexBoxModel(props)}
    `;
  }}
`;

export default Box;
