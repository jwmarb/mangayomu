import Manga from '@components/Manga';
import { calculateCoverHeight, calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import { LayoutLibraryMangaType, LayoutMangaExtendedState } from './MangaLibrary.recycler';
import { AppState } from '@redux/store';
import { Manga as IManga } from '@services/scraper/scraper.interfaces';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import React from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components/native';
import { MangaCoverStyles } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { Orientation } from 'expo-screen-orientation';
export type MangaInLibraryProps = {
  manga: IManga;
  first?: boolean;
  last?: boolean;
  dynamic?: boolean;
} & LayoutMangaExtendedState;

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
    const { width = Dimensions.get('window').width } = props;
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
      width: ${containerWidth + test}px;
      height: ${() => {
        switch (props.type) {
          case MangaCoverStyles.CLASSIC:
          default:
            return calculateCoverHeight(props.cols) * SPACE_MULTIPLIER + props.fontSize * 4 + spacing;
          case MangaCoverStyles.MODERN:
            return calculateCoverHeight(props.cols) * SPACE_MULTIPLIER + spacing;
        }
      }}px;
      background-color: ${() => {
        if (props.first) return 'red';
        if (props.last) return 'blue';
        return 'purple';
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

export const MangaInLibrary: React.FC<MangaInLibraryProps> = React.memo(
  ({ manga, first, last, dynamic, width, orientation, cols, fontSize, type }) => {
    return (
      <MangaInLibraryContainer
        orientation={orientation}
        cols={cols}
        first={first}
        last={last}
        dynamic={dynamic}
        fontSize={fontSize}
        type={type}
        width={width}>
        <Manga {...manga} />
      </MangaInLibraryContainer>
    );
  }
);
