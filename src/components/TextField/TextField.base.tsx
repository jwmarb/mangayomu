import styled, { css } from 'styled-components/native';

export const TextFieldContainer = styled.View`
  ${(props) => css`
    flex-grow: 1;
    flex-shrink: 1;
  `}
`;

export const TextFieldBase = styled.TextInput.attrs((props) => ({
  placeholderTextColor: props.theme.palette.text.disabled.get(),
}))`
  ${(props) => css`
    ${props.theme.typography.body1}
    background-color: ${props.theme.palette.background.paper.get()};
    height: 100%;
    width: 100%;
    color: ${props.theme.palette.text.primary.get()};
  `}
`;
