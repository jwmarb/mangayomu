import useScreenDimensions from '@hooks/useScreenDimensions';
import { ReadingDirection } from '@redux/slices/settings';
import { ConnectedChapterPageProps } from '@screens/Reader/components/ChapterPage/ChapterPage.redux';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import React from 'react';

export default function usePageScale(props: ConnectedChapterPageProps) {
  const { readingDirection } = useChapterPageContext();
  const { width, height } = useScreenDimensions();
  const imageWidth = props.page.width;
  const imageHeight = props.page.height;
  const scale = React.useMemo(() => width / imageWidth, [imageWidth, width]);
  const stylizedHeight = React.useMemo(
    () =>
      readingDirection !== ReadingDirection.WEBTOON
        ? scale * imageHeight
        : height,
    [scale, imageHeight, height, readingDirection],
  );

  return { scale, stylizedHeight };
}
