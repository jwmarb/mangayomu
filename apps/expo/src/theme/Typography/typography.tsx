import { rem } from '@theme/Typography/typography.helpers';
import { css } from 'styled-components/native';
let store: any;
export function injectStoreForTypography(_store: any) {
  store = _store;
}

export enum FontFamily {
  ROBOTO = 'Roboto',
  NUNITO = 'Nunito',
  OPEN_SANS = 'Open Sans',
  QUICKSAND = 'Quicksand',
  CAVEAT = 'Caveat',
  CHAKRA_PETCH = 'Chakra Petch',
  MONTSERRAT_ALTERNATES = 'Montserrat Alternates',
  MONTSERRAT = 'Montserrat',
}

const defaultFontFamily = {
  light: 'Nunito-light',
  regular: 'Nunito',
  heavy: 'Nunito-heavy',
  semi: 'Nunito-semi',
};
export const typographyVariants = (fontFamily: FontFamily) => ({
  body1: css`
    font-family: ${fontFamily};
    font-size: ${rem(13)};
    letter-spacing: -0.44px;
  `,
  body2: css`
    font-family: ${fontFamily};
    font-size: ${rem(12)};
    letter-spacing: -0.2px;
  `,
  header: css`
    font-family: ${fontFamily}-light;

    font-size: ${rem(20)};
    letter-spacing: -0.2px;
  `,
  button: css`
    font-family: ${fontFamily}-heavy;

    font-size: ${rem(12)};
    letter-spacing: -0.44px;
  `,
  subheader: css`
    font-family: ${fontFamily}-heavy;

    font-size: ${rem(18)};
    letter-spacing: -0.2px;
  `,
  tabtitle: css`
    font-family: ${fontFamily}-heavy;

    font-size: ${rem(15)};
    letter-spacing: -0.28px;
  `,
  bottomtab: css`
    font-family: ${fontFamily}-heavy;

    font-size: ${rem(10)};
    letter-spacing: -0.56px;
  `,
});

export const typographyTheme = (fontFamily?: FontFamily) => ({
  fontFamily: fontFamily ?? store ? store.getState().settings.fontFamily : defaultFontFamily,

  ...typographyVariants(fontFamily ?? FontFamily.NUNITO),
});
