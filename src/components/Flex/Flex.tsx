import { FlexProps } from '@components/Flex/Flex.interfaces';
import styled, { css } from 'styled-components/native';

export const Flex = styled.View<Partial<FlexProps>>`
  ${(props) => css`
    ${() => {
      if (props.grow)
        return css`
          flex-grow: 1;
        `;
      if (props.shrink)
        return css`
          flex-shrink: 1;
        `;

      return css`
        display: flex;
      `;
    }}
    flex-direction: ${props.direction ?? 'row'};
    align-items: ${props.alignItems ?? 'stretch'};
    justify-content: ${props.justifyContent ?? 'flex-start'};
  `}
`;
