import { TypographySkeletonProps } from '@components/Typography/Typography.interfaces';
import { rem } from '@theme/Typography';
import React from 'react';
import styled, { css } from 'styled-components/native';
const TypographySkeletonBase = styled.Text<TypographySkeletonProps>`
  ${(props) => css`
    ${props.theme.typography[props.variant ?? 'body1']};
    background-color: ${props.theme.palette.action.disabledBackground.get()};
    color: transparent;
    border-radius: ${props.theme.borderRadius}px;
    width: ${typeof props.width === 'string' ? props.width : `${props.width}px`};
  `}
`;

const placeholder = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Repellat temporibus ut, tempore culpa aliquid explicabo excepturi, deserunt corporis quos quidem voluptatibus soluta a architecto debitis magni voluptas, error unde aliquam?`;

function lastIndex(width: string | number) {
  if (typeof width === 'number') return width;
  return Math.floor(placeholder.length * (Number(width.replace('%', '')) / 100));
}

const TypographySkeleton: React.FC<TypographySkeletonProps> = (props) => {
  const { width } = props;
  return (
    <TypographySkeletonBase {...props} numberOfLines={1}>
      {placeholder.substring(0, lastIndex(width))}
    </TypographySkeletonBase>
  );
};

export default TypographySkeleton;
