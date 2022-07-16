import Manga from '@components/Manga';
import { calculateCoverHeight, calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import { LayoutLibraryMangaType } from './MangaLibrary.recycler';
import { AppState } from '@redux/store';
import { Manga as IManga } from '@services/scraper/scraper.interfaces';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import React from 'react';
import { Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components/native';
const { width } = Dimensions.get('window');
import { MangaCoverStyles } from '@redux/reducers/settingsReducer/settingsReducer.constants';
export type MangaInLibraryProps = {
  manga: IManga;
  first?: boolean;
  last?: boolean;
  dynamic?: boolean;
};

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

export const MangaInLibraryContainer = styled.View<
  Omit<MangaInLibraryProps, 'manga'> & {
    fontSize: number;
    type: MangaCoverStyles;
    cols: number;
  }
>`
  ${(props) => {
    const spacing = SPACE_MULTIPLIER * 2;
    const containerWidth = calculateCoverWidth(props.cols) * SPACE_MULTIPLIER + spacing;
    const totalMangasPerRow = width / containerWidth;
    const maxMangasPerRow = Math.floor(totalMangasPerRow);
    // if (props.first) {
    //   const totalMangasPerRow = width / containerWidth;
    //   const maxMangasPerRow = Math.floor(totalMangasPerRow);
    //   const marginLeft = (width - containerWidth * maxMangasPerRow) / 2;
    //   return css`
    //     margin-left: ${marginLeft}px;
    //     width: ${containerWidth}px;
    //     padding-top: ${props.theme.spacing(1)};
    //     padding-bottom: ${props.theme.spacing(1)};
    //     align-items: center;
    //     justify-content: center;
    //   `;
    // }
    const test = width / maxMangasPerRow - width / totalMangasPerRow;
    return css`
      width: ${props.dynamic ? '100%' : `${containerWidth + test}px`};
      height: ${() => {
        switch (props.type) {
          case MangaCoverStyles.CLASSIC:
          default:
            return calculateCoverHeight(props.cols) * SPACE_MULTIPLIER + props.fontSize * 4 + spacing;
          case MangaCoverStyles.MODERN:
            return calculateCoverHeight(props.cols) * SPACE_MULTIPLIER + spacing;
        }
      }}px;
     
      ${() => {
        if (props.first) {
          if (maxMangasPerRow === 1 || props.dynamic) return;
          else
            return css`
              padding-left: ${test}px;
            `;
        }
        if (props.last)
          return css`
            padding-right: ${test}px;
          `;

        return css`
          padding-horizontal: ${test / 2}px;
        `;
      }}
      /* padding-top: ${props.theme.spacing(1)}; */
      /* padding-bottom: ${props.theme.spacing(1)}; */
      align-items: center;
      /* justify-content: center;
      align-items: ${() => {
        if (maxMangasPerRow === 1) return 'center';
        if (props.first) return 'flex-end';
        if (props.last) return 'flex-start';
        return 'center';
      }}; ; */
    `;
  }}
`;

export const MangaInLibrary: React.FC<MangaInLibraryProps> = React.memo(({ manga, first, last, dynamic }) => {
  const cols = useSelector((state: AppState) => state.settings.mangaCover.perColumn);
  const fontSize = useSelector((state: AppState) => state.settings.mangaCover.fontSize);
  const type = useSelector((state: AppState) => state.settings.mangaCover.style);
  return (
    <MangaInLibraryContainer cols={cols} first={first} last={last} dynamic={dynamic} fontSize={fontSize} type={type}>
      <Manga {...manga} />
    </MangaInLibraryContainer>
  );
});
