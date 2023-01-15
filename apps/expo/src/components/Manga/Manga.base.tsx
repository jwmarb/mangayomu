import { calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import pixelToNumber from '@utils/pixelToNumber';
import { Dimensions } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
const { width } = Dimensions.get('window');

export const MangaBaseContainer = styled.View<{ cols: number }>`
  ${(props) => css`
    width: ${props.theme.spacing(calculateCoverWidth(props.cols))};
  `}
`;
