import Screen from '@components/Screen';
import styled, { css } from 'styled-components/native';

export const WelcomeBase = styled(Screen)`
  ${(props) => css`
    padding: ${props.theme.spacing(0, 3)};
    height: 100%;
  `}
`;
