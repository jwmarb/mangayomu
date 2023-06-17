import { AnimatedFlashList } from '@components/animated';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import useUnfinishedMangas from '@hooks/useUnfinishedMangas';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import React from 'react';

const UnfinishedMangaList: React.FC<
  RootStackProps<'UnfinishedMangaList'>
> = () => {
  const [unfinishedMangas] = useUnfinishedMangas();
  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({ headerTitle: 'Mangas' });
  return (
    <AnimatedFlashList
      renderItem={() => null}
      data={unfinishedMangas}
      contentContainerStyle={contentContainerStyle}
      style={scrollViewStyle}
      onScroll={onScroll}
    />
  );
};

export default UnfinishedMangaList;
