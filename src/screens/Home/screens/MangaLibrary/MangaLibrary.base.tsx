import Manga from '@components/Manga';
import { calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import { AppState } from '@redux/store';
import { Manga as IManga } from '@services/scraper/scraper.interfaces';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import React from 'react';
import { Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components/native';
const { width } = Dimensions.get('window');
export const MangaContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(0, 1)};
  `}
`;

export const ExpandedSortContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(3)};
    background-color: ${props.theme.palette.background.paper.get()};
  `}
`;

export const MangaInLibraryContainer = styled.View<{ cols: number; first?: boolean }>`
  ${(props) => {
    const spacing = SPACE_MULTIPLIER * 2;
    const containerWidth = calculateCoverWidth(props.cols) * SPACE_MULTIPLIER + spacing;
    if (props.first) {
      const totalMangasPerRow = width / containerWidth;
      const maxMangasPerRow = Math.floor(totalMangasPerRow);
      const marginLeft = (width - containerWidth * maxMangasPerRow) / 2;
      return css`
        margin-left: ${marginLeft}px;
        width: ${containerWidth}px;
        padding-top: ${props.theme.spacing(1)};
        padding-bottom: ${props.theme.spacing(1)};
        align-items: center;
        justify-content: center;
      `;
    }
    return css`
      width: ${containerWidth}px;
      padding-top: ${props.theme.spacing(1)};
      padding-bottom: ${props.theme.spacing(1)};
      justify-content: center;
      align-items: center;
    `;
  }}
`;

export const MangaInLibrary: React.FC<{ manga: IManga; first?: boolean }> = React.memo(({ manga, first }) => {
  const cols = useSelector((state: AppState) => state.settings.mangaCover.perColumn);
  return (
    <MangaInLibraryContainer cols={cols} first={first}>
      <Manga {...manga} />
    </MangaInLibraryContainer>
  );
});
