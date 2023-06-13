import { MangaSchema } from '@database/schemas/Manga';
import React from 'react';

export interface OverlayFooterProps {
  style: (
    | {
        transform: {
          translateY: number;
        }[];
      }
    | {
        opacity: number;
      }
  )[];
}
