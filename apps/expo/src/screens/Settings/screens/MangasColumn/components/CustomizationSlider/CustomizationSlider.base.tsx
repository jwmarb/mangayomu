import styled, { css } from 'styled-components/native';

export const CustomizationSliderContainer = styled.View`
  ${(props) => css`
    display: flex;
    flex-direction: column;
    padding: ${props.theme.spacing(2, 9.5, 2, 9.5)};
  `}
`;
