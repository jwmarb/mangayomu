import useReaderSetting from '@/hooks/useReaderSetting';
import { BackgroundColorMap } from '@/stores/settings';
import { Manga } from '@mangayomu/mangascraper';
import React from 'react';

export default function useBackgroundColor(manga: Manga) {
  const { state } = useReaderSetting('backgroundColor', manga);
  const contentContainerStyle = React.useMemo(
    () => ({ backgroundColor: BackgroundColorMap[state] }),
    [state],
  );
  return [contentContainerStyle, state] as const;
}
