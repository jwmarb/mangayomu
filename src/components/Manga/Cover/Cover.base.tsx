import { MangaCoverProps } from '@components/Manga/Cover/Cover.interfaces';
import { ProcessedMangaCoverProps } from '@components/Manga/Cover/Cover.redux';
import pixelToNumber from '@utils/pixelToNumber';
import { Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';

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

export const MangaCoverBaseContainer = styled.View<{ imageWidth: string; imageHeight: string }>`
  ${(props) => css`
    border-radius: ${props.theme.borderRadius}px;
    width: ${props.imageWidth};
    height: ${props.imageHeight};
  `}
`;

export const FixedMangaCoverBase = styled.Image.attrs({ cache: 'force-cache' })`
  ${(props) => css`
    border-radius: ${props.theme.borderRadius}px;
    width: ${props.theme.spacing(18)};
    height: ${props.theme.spacing(360 / 13)};
  `}
`;

export const FixedMangaCoverBaseContainer = styled.View`
  ${(props) => css`
    border-radius: ${props.theme.borderRadius}px;
    width: ${props.theme.spacing(18)};
    height: ${props.theme.spacing(360 / 13)};
  `}
`;
