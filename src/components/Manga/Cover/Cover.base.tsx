import { MangaCoverProps } from '@components/Manga/Cover/Cover.interfaces';
import { ProcessedMangaCoverProps } from '@components/Manga/Cover/Cover.redux';
import pixelToNumber from '@utils/pixelToNumber';
import { Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Constants } from '@theme/core';
import React from 'react';

export const MangaCoverBaseImageBackground = styled.ImageBackground.attrs({ imageStyle: { borderRadius: 4 } })`
  width: 100%;
  height: 100%;
` as React.FC<{ source: { uri: string } }>;

export const ModernMangaLinearGradient = styled(LinearGradient).attrs({
  colors: ['transparent', Constants.GRAY[12].get()],
})`
  ${(props) => css`
    height: 100%;
    justify-content: flex-end;
    padding: ${props.theme.spacing(1)};
  `}
`;

export const ModernMangaCoverBase = styled(Animated.View)<{
  imageWidth: string;
  imageHeight: string;
}>`
  ${(props) => css`
    border-radius: 4px;
    border: 1px solid ${props.theme.palette.divider.get()};
    width: ${props.imageWidth};
    height: ${props.imageHeight};
  `}
`;

export const MangaCoverBase = styled(Animated.Image).attrs({ cache: 'force-cache' })<{
  imageWidth: string;
  imageHeight: string;
}>`
  ${(props) => css`
    border-radius: ${props.theme.borderRadius}px;
    width: ${props.imageWidth};
    height: ${props.imageHeight};
  `}
`;

export const MangaCoverLoadingBase = styled(Animated.View).attrs({ cache: 'force-cache' })<{
  imageWidth: string;
  imageHeight: string;
}>`
  ${(props) => css`
    background-color: ${props.theme.palette.action.disabledBackground.get()};
    border-radius: ${props.theme.borderRadius}px;
    width: ${props.imageWidth};
    height: ${props.imageHeight};
  `}
`;

export const MangaCoverBaseContainer = styled.View<{ imageWidth: string; imageHeight: string }>`
  ${(props) => css`
    border-radius: ${props.theme.borderRadius}px;
    width: ${props.imageWidth};
    height: ${props.imageHeight};
  `}
`;

export const FixedMangaLoadingCoverBase = styled(Animated.View)<{
  fixedSize: MangaCoverProps['fixedSize'];
}>`
  ${(props) => css`
    border-radius: ${props.theme.borderRadius}px;
    background-color: ${props.theme.palette.action.disabledBackground.get()};

    ${() => {
      switch (props.fixedSize) {
        case true:
        case 'medium':
          return css`
            width: ${props.theme.spacing(18)};
            height: ${props.theme.spacing(360 / 13)};
          `;
        case 'small':
          return css`
            width: ${props.theme.spacing(12)};
            height: ${props.theme.spacing(240 / 13)};
          `;
      }
    }}
  `}
`;

export const FixedMangaCoverBase = styled(Animated.Image).attrs({ cache: 'force-cache' })<{
  fixedSize: MangaCoverProps['fixedSize'];
}>`
  ${(props) => css`
    border-radius: ${props.theme.borderRadius}px;
    ${() => {
      switch (props.fixedSize) {
        case true:
        case 'medium':
          return css`
            width: ${props.theme.spacing(18)};
            height: ${props.theme.spacing(360 / 13)};
          `;
        case 'small':
          return css`
            width: ${props.theme.spacing(12)};
            height: ${props.theme.spacing(240 / 13)};
          `;
      }
    }}
  `}
`;

export const FixedMangaCoverBaseContainer = styled.View<{
  fixedSize: MangaCoverProps['fixedSize'];
}>`
  ${(props) => css`
    border-radius: ${props.theme.borderRadius}px;
    ${() => {
      switch (props.fixedSize) {
        case true:
        case 'medium':
          return css`
            width: ${props.theme.spacing(18)};
            height: ${props.theme.spacing(360 / 13)};
          `;
        case 'small':
          return css`
            width: ${props.theme.spacing(12)};
            height: ${props.theme.spacing(240 / 13)};
          `;
      }
    }}
  `}
`;
