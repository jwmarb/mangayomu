import styled, { css } from 'styled-components/native';
import React from 'react';
import Flex from '@components/Flex';
import Spacer from '@components/Spacer';
import { TypographySkeleton } from '@components/Typography';
import { MangaBaseContainer } from '@components/Manga/Manga.base';
import pixelToNumber from '@utils/pixelToNumber';
import { RFValue } from 'react-native-responsive-fontsize';

const MangaSkeletonImage = styled.View`
  ${(props) => css`
    width: ${RFValue(pixelToNumber(props.theme.spacing(13)))}px;
    height: ${RFValue(pixelToNumber(props.theme.spacing(20)))}px;
    border-radius: ${props.theme.borderRadius}px;
    background-color: ${props.theme.palette.action.disabledBackground.get()};
  `}
`;

const MangaSkeleton: React.FC = (props) => {
  return (
    <MangaBaseContainer>
      <Flex direction='column'>
        <MangaSkeletonImage />
        <Spacer y={0.5} />
        <TypographySkeleton width='100%' />
        <Spacer y={0.5} />
        <TypographySkeleton width='100%' />
      </Flex>
    </MangaBaseContainer>
  );
};

export default MangaSkeleton;
