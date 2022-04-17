import { ProgressProps } from '@components/Progress/Progress.interfaces';
import { Color } from '@theme/core';
import { rem } from '@theme/Typography';
import styled, { css } from 'styled-components/native';
export const ProgressCircle = styled.View<ProgressProps>`
  ${(props) => css`
    background-color: ${Color.valueOf(props.color ?? 'primary')};
    width: ${rem(6)};
    height: ${rem(6)};
    border-radius: 100px;
  `}
`;
