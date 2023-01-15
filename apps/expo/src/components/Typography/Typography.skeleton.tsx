import { TypographySkeletonProps } from '@components/Typography/Typography.interfaces';
import { AppState } from '@redux/store';
import { rem } from '@theme/Typography';
import React from 'react';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components/native';
const TypographySkeletonBase = styled.Text<TypographySkeletonProps>`
  ${(props) => css`
    ${props.theme.typography()[props.variant ?? 'body1']};
    background-color: ${props.theme.palette.action.disabledBackground.get()};
    font-size: ${props.fontSize}px;
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
  const fontSize = useSelector((state: AppState) => state.settings.mangaCover.fontSize);
  return (
    <TypographySkeletonBase {...props} fontSize={fontSize} numberOfLines={1}>
      {placeholder.substring(0, lastIndex(width))}
    </TypographySkeletonBase>
  );
};

export default TypographySkeleton;
