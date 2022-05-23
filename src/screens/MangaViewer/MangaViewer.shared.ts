import Chapter from '@components/Chapter';
import { ChapterPressableMode } from '@components/Chapter/Chapter.interfaces';
import { Constants } from '@theme/core';
import React from 'react';

export const GRADIENT_COLOR = Constants.GRAY['13'];

export default class SharedMangaViewerRefs {
  private static refs: (React.ElementRef<typeof Chapter> | null)[] = [];
  public static getRef(index: number) {
    return this.refs[index];
  }
  public static setRef(ref: any, index: number) {
    this.refs[index] = ref;
  }

  public static size(): number {
    return this.refs.length;
  }

  public static clearRefs() {
    this.refs = [];
  }
}
