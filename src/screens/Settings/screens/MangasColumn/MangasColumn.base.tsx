import Flex from '@components/Flex';
import { calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import { Dimensions } from 'react-native';
import Animated from 'react-native-reanimated';
import styled, { css } from 'styled-components/native';
const { height } = Dimensions.get('window');

export const MangasColumnPreviewContainer = styled.View`
  ${(props) => css`
    padding: ${props.theme.spacing(2, 0, 24, 0)};
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  `}
`;

export const MangasColumnSettingsContainer = styled(Flex).attrs({ spacing: 2, direction: 'column' })`
  ${(props) => css`
    padding: ${props.theme.spacing(2, 3)};
    background-color: ${props.theme.palette.background.paper.get()};
    min-height: 100%;
  `}
`;

export const MangaCoverPreview = styled(Animated.Image).attrs({ cache: 'force-cache' })`
  ${(props) => css`
    border-radius: ${props.theme.borderRadius}px;
  `}
`;

export const MangaCoverPreviewContainer = styled(Animated.View)`
  ${(props) => css`
    display: flex;
    flex-direction: column;
    margin: ${props.theme.spacing(1)};
  `}
`;
