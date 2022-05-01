import {
  MangaCoverBase,
  MangaCoverBaseContainer,
  FixedMangaCoverBaseContainer,
  FixedMangaCoverBase,
} from '@components/Manga/Cover/Cover.base';
import { calculateCoverHeight, calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import connector, { ProcessedMangaCoverProps } from '@components/Manga/Cover/Cover.redux';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import React from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';
import { useTheme } from 'styled-components/native';
const { width } = Dimensions.get('window');

const Cover: React.FC<ProcessedMangaCoverProps> = (props) => {
  const { uri, cols, fixedSize } = props;
  const theme = useTheme();
  const imageWidth = theme.spacing(calculateCoverWidth(cols));
  const imageHeight = theme.spacing(calculateCoverHeight(cols));

  if (fixedSize)
    return (
      <FixedMangaCoverBaseContainer>
        <FixedMangaCoverBase source={{ uri }} />
      </FixedMangaCoverBaseContainer>
    );

  return (
    <MangaCoverBaseContainer imageWidth={imageWidth} imageHeight={imageHeight}>
      <MangaCoverBase source={{ uri }} imageWidth={imageWidth} imageHeight={imageHeight} />
    </MangaCoverBaseContainer>
  );
};

export default connector(Cover);
