import pixelToNumber from '@utils/pixelToNumber';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';

export const MangaBaseContainer = styled.View`
  ${(props) => css`
    width: ${RFValue(pixelToNumber(props.theme.spacing(13)))}px;
  `}
`;
