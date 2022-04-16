import styled, { css } from 'styled-components/native';
import React from 'react';
import Flex from '@components/Flex';
import Spacer from '@components/Spacer';
import { TypographySkeleton } from '@components/Typography';
import { MangaBaseContainer } from '@components/Manga/Manga.base';

const MangaSkeletonImage = styled.View`
  ${(props) => css`
    width: ${props.theme.spacing(13)};
    height: ${props.theme.spacing(20)};
    border-radius: ${props.theme.borderRadius}px;
    background-color: ${props.theme.palette.action.disabledBackground.get()};
  `}
`;

const MangaSkeleton: React.FC = (props) => {
  return (
    <MangaBaseContainer>
      <Flex direction='column'>
        <MangaSkeletonImage />
        <Spacer y={1} />
        <TypographySkeleton width={1} />
        <Spacer y={0.5} />

        <TypographySkeleton width={1} />
      </Flex>
    </MangaBaseContainer>
  );
};

export default MangaSkeleton;
