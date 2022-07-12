import {
  MangaCoverBase,
  MangaCoverBaseContainer,
  FixedMangaCoverBaseContainer,
  FixedMangaCoverBase,
  FixedMangaLoadingCoverBase,
  MangaCoverLoadingBase,
} from '@components/Manga/Cover/Cover.base';
import { calculateCoverHeight, calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import connector, { ProcessedMangaCoverProps } from '@components/Manga/Cover/Cover.redux';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import React from 'react';
import { Dimensions, useWindowDimensions } from 'react-native';
import { useTheme } from 'styled-components/native';
const { width } = Dimensions.get('window');
import * as FileSystem from 'expo-file-system';
import Progress from '@components/Progress';
import { animate, withAnimatedLoading, withAnimatedMounting } from '@utils/Animations';
import { FadeIn, FadeOut } from 'react-native-reanimated';

const Cover: React.FC<ProcessedMangaCoverProps> = (props) => {
  const { uri, cols, fixedSize, customSize, base64, cacheMangaCover } = props;
  const setBase64 = (b: string | null) => cacheMangaCover(uri, b);

  const theme = useTheme();
  const imageWidth = theme.spacing(calculateCoverWidth(customSize ?? cols));
  const imageHeight = theme.spacing(calculateCoverHeight(customSize ?? cols));

  async function initialize() {
    console.log(uri);
    if (base64 === undefined) {
      const fileUri = FileSystem.cacheDirectory + `${uri.replace(/[\\/]|(https?:)/g, '')}`;
      try {
        const info = await FileSystem.getInfoAsync(fileUri);
        if (!info.exists) {
          const p = await FileSystem.downloadAsync(uri, fileUri);
          setBase64(p.uri);
        } else {
          setBase64(fileUri);
        }
      } catch (e) {
        setBase64(null);
      }
    }
  }

  React.useEffect(() => {
    initialize();
  }, []);

  if (fixedSize)
    return (
      <FixedMangaCoverBaseContainer fixedSize={fixedSize}>
        {base64 === null && <FixedMangaCoverBase source={{ uri }} fixedSize={fixedSize} entering={FadeIn} />}
        {base64 === undefined && <FixedMangaLoadingCoverBase fixedSize={fixedSize} exiting={FadeOut} />}
        {base64 != null && <FixedMangaCoverBase source={{ uri: base64 }} fixedSize={fixedSize} entering={FadeIn} />}
      </FixedMangaCoverBaseContainer>
    );

  return (
    <MangaCoverBaseContainer imageWidth={imageWidth} imageHeight={imageHeight}>
      <MangaCoverBase source={{ uri }} imageWidth={imageWidth} imageHeight={imageHeight} entering={FadeIn} />
      {/* {base64 != null && (
        <MangaCoverBase source={{ uri: base64 }} imageWidth={imageWidth} imageHeight={imageHeight} entering={FadeIn} />
      )}
      {base64 === undefined && (
        <MangaCoverLoadingBase imageWidth={imageWidth} imageHeight={imageHeight} exiting={FadeOut} />
      )}
      {base64 === null && (
        <MangaCoverBase source={{ uri }} imageWidth={imageWidth} imageHeight={imageHeight} entering={FadeIn} />
      )} */}
    </MangaCoverBaseContainer>
  );
};

export default connector(Cover);
