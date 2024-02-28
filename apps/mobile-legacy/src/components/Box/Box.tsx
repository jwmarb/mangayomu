import styled, { css } from '@emotion/native';
import { BoxProps } from './';
import {
  implementBorderModel,
  implementBoxModel,
  implementDimensionsModel,
  implementFlexBoxModel,
  implementPositionModel,
  set,
  setWithPalette,
} from './Box.helpers';
import Animated from 'react-native-reanimated';

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
      opacity = 1,
    } = props;

    return css`
      ${boxShadow && theme.style.shadow};
      opacity: ${opacity};
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

export const AnimatedBox = Animated.createAnimatedComponent(Box);

export default Box;
