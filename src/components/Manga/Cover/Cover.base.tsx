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

export const FixedMangaCoverBase = styled.Image.attrs({ cache: 'force-cache' })<{
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
