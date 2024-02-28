import '@mangayomu/theme';
import { Theme as EmotionTheme } from '@emotion/react';
import { Helpers } from '@theme/helpers';

declare module '@mangayomu/theme' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends EmotionTheme {}
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface ThemeHelpers extends Helpers, DefaultThemeHelpers {}
}
