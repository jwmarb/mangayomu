import { AppColors } from '@theme/Color/Color.interfaces';
import { Color } from '@theme/core';
import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';

export const BadgeContainer = styled(Animated.View)<{ color: AppColors }>`
  ${(props) => css`
    position: absolute;
    align-items: center;
    justify-content: center;
    top: 2px;
    right: 2px;
    background-color: ${() => {
      if (props.color instanceof Color) return props.color.get();
      return Color.valueOf(props.color);
    }};
    width: 16px;
    height: 16px;
    z-index: 1000;
    border-top-left-radius: 1000px;
    border-top-right-radius: 1000px;
    border-bottom-right-radius: 1000px;
    border-bottom-left-radius: 1000px;
  `}
`;
