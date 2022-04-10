import { typographyTheme, typographyVariants } from '@theme/Typography/typography';
import React from 'react';

export type TypographyVariants = keyof typeof typographyVariants;

export type TypographyTheme = typeof typographyTheme;
