import { ResponsiveImageProps } from '@components/ResponsiveImage/ResponsiveImage.interface';
import styled, { css } from 'styled-components/native';

export const ResponsiveImageBase = styled.Image.attrs<ResponsiveImageProps>((props) => ({
  resizeMode: props.resizeMode,
}))`
  width: 100%;
  height: 100%;
`;

export const ResponsiveImageContainer = styled.View<ResponsiveImageProps>`
  ${(props) => css`
    width: ${props.width
      ? () => {
          switch (typeof props.width) {
            case 'number':
              return `${props.width}px`;
            default:
            case 'string':
              return props.width;
          }
        }
      : '100%'};
    height: ${props.height
      ? () => {
          switch (typeof props.height) {
            case 'number':
              return `${props.height}px`;
            default:
            case 'string':
              return props.height;
          }
        }
      : '100%'};
  `}
`;
