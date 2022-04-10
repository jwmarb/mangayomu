import { rem } from '@theme/Typography/typography.helpers';
import { css } from 'styled-components/native';

const typographyConstants = {
  fontFamily: {
    light: 'Nunito-light',
    regular: 'Nunito',
    heavy: 'Nunito-heavy',
    semi: 'Nunito-semi',
  },
};

export const typographyVariants = {
  body1: css`
    font-family: ${typographyConstants.fontFamily.regular};
    font-size: ${rem(13)};
    letter-spacing: -0.44px;
  `,
  body2: css`
    font-family: ${typographyConstants.fontFamily.regular};
    font-size: ${rem(12)};
    letter-spacing: -0.2px;
  `,
  header: css`
    font-family: ${typographyConstants.fontFamily.light};
    font-size: ${rem(20)};
    letter-spacing: -0.2px;
  `,
  button: css`
    font-family: ${typographyConstants.fontFamily.heavy};
    font-size: ${rem(12)};
    letter-spacing: -0.44px;
  `,
};

export const typographyTheme = {
  ...typographyConstants,
  ...typographyVariants,
};
