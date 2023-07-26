import useScreenDimensions from '@hooks/useScreenDimensions';
import { ConnectedChapterPageProps } from '@screens/Reader/components/ChapterPage/ChapterPage.redux';
import React from 'react';

export default function usePageScale(props: ConnectedChapterPageProps) {
  const { width } = useScreenDimensions();
  const imageWidth = props.page.width;
  const imageHeight = props.page.height;
  const scale = React.useMemo(() => width / imageWidth, [imageWidth, width]);
  const stylizedHeight = React.useMemo(
    () => scale * imageHeight,
    [scale, imageHeight],
  );

  return { scale, stylizedHeight };
}
