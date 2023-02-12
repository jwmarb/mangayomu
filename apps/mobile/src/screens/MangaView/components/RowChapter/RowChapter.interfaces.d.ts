import { ChapterSchema } from '@database/schemas/Chapter';
import React from 'react';

export type RowChapterProps =
  | {
      rowChapterKey: string;
    }
  | { loading: boolean };
