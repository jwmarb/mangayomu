import '@mangayomu/theme';
import { Theme as EmotionTheme } from '@emotion/react';

declare module '@mangayomu/theme' {
  export type Theme = EmotionTheme;
}
