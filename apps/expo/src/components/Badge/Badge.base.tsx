import { AppColors } from '@theme/Color/Color.interfaces';
import { Color } from '@theme/core';
import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';
import { rem } from '@theme/core';

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
    width: ${rem(20)};
    height: ${rem(20)};
    z-index: 1000;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    border-bottom-left-radius: 4px;
  `}
`;
