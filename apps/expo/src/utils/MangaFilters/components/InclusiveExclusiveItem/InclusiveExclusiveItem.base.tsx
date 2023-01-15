import { InclusiveExclusiveItemProps } from '@utils/MangaFilters/components/InclusiveExclusiveItem/InclusiveExclusiveItem.interfaces';
import { RFValue } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';

export const IndicatorContainer = styled.View<Pick<InclusiveExclusiveItemProps, 'state'>>`
  ${(props) => css`
    background-color: ${() => {
      switch (props.state) {
        case 'exclude':
          return props.theme.palette.secondary.main.get();
        case 'include':
          return props.theme.palette.primary.main.get();
        case 'none':
          return props.theme.palette.background.paper.get();
      }
    }};
    border-radius: ${props.theme.borderRadius / 2}px;
    width: ${RFValue(14)}px;
    height: ${RFValue(14)}px;
  `}
`;

export const IndicatorBaseContainer = styled.View`
  ${(props) => css`
    border-radius: ${props.theme.borderRadius / 2}px;
    border: 2px solid ${props.theme.palette.divider.get()};
    overflow: hidden;
  `}
`;
