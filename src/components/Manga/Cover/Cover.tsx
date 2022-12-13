import {
  MangaCoverBase,
  MangaCoverBaseContainer,
  FixedMangaCoverBaseContainer,
  FixedMangaCoverBase,
  FixedMangaLoadingCoverBase,
  ModernMangaCoverBase,
  MangaCoverBaseImageBackground,
  ModernMangaLinearGradient,
  LoadingCoverContainer,
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
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { MangaCoverStyles } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import ExpoStorage from '@utils/ExpoStorage';
import { MangaSkeletonImage, FixedSizeMangaSkeletonImage } from '@components/Manga/Manga.skeleton';
import { Typography } from '@components/Typography';

const Cover: React.FC<React.PropsWithChildren<ProcessedMangaCoverProps>> = (props) => {
  const { uri, cols, fixedSize, customSize, coverStyle, children, cacheEnabled, maxCacheSize } = props;
  const [base64, setBase64] = React.useState<string | null | undefined>(undefined);
  const [loading, setLoading] = React.useState<boolean>(true);

  const theme = useTheme();
  const imageWidth = theme.spacing(calculateCoverWidth(customSize ?? cols));
  const imageHeight = theme.spacing(calculateCoverHeight(customSize ?? cols));

  async function initialize() {
    if (base64 === undefined && cacheEnabled) {
      const fileUri = ExpoStorage.IMAGE_CACHE_DIRECTORY + `${uri.replace(/[\\/]|(https?:)|\?.*/g, '')}`;
      try {
        const info = await FileSystem.getInfoAsync(fileUri);
        if (!info.exists) {
          const { size } = await FileSystem.getInfoAsync(ExpoStorage.IMAGE_CACHE_DIRECTORY);
          if (size == null) throw Error('Unable to measure cache directory size. Perhaps it does not exist?');
          if (size >= maxCacheSize)
            throw Error(
              'The current cache exceeds its user-defined limit, and thus saving the image cannot be performed'
            );
          const p = await FileSystem.downloadAsync(uri, fileUri);
          console.log(`Downloaded cover image: ${uri}`);
          setBase64(p.uri);
        } else {
          console.log(`Found existing cover image: ${uri}`);
          setBase64(fileUri);
        }
      } catch (e) {
        console.log(e);
        setBase64(null);
      }
    }
  }

  React.useEffect(() => {
    initialize();
  }, []);

  function handleOnLoad() {
    setLoading(false);
  }

  if (fixedSize)
    return (
      <FixedMangaCoverBaseContainer fixedSize={fixedSize}>
        {base64 !== null && (
          <FixedMangaCoverBase
            onLoad={handleOnLoad}
            onError={handleOnLoad}
            source={{ uri: cacheEnabled ? base64 : uri }}
            fixedSize={fixedSize}
            entering={FadeIn}
          />
        )}
        {loading && (
          <LoadingCoverContainer>
            <FixedSizeMangaSkeletonImage fixedSize={fixedSize} />
          </LoadingCoverContainer>
        )}
      </FixedMangaCoverBaseContainer>
    );

  switch (coverStyle) {
    default:
    case MangaCoverStyles.CLASSIC:
      return (
        <MangaCoverBaseContainer imageWidth={imageWidth} imageHeight={imageHeight}>
          <MangaCoverBase
            onLoad={handleOnLoad}
            source={{ uri: cacheEnabled ? base64 : uri }}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            entering={FadeIn}
          />
          {loading && (
            <LoadingCoverContainer>
              <MangaSkeletonImage cols={cols} />
            </LoadingCoverContainer>
          )}
        </MangaCoverBaseContainer>
      );
    case MangaCoverStyles.MODERN:
      return (
        <ModernMangaCoverBase imageWidth={imageWidth} imageHeight={imageHeight} entering={FadeIn}>
          <MangaCoverBaseImageBackground source={{ uri: cacheEnabled ? base64 : uri }}>
            <ModernMangaLinearGradient>{children}</ModernMangaLinearGradient>
          </MangaCoverBaseImageBackground>
        </ModernMangaCoverBase>
      );
  }
};

export default connector(Cover);
