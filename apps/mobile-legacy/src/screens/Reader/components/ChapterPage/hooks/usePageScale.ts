import useScreenDimensions from '@hooks/useScreenDimensions';
import { ChapterPageProps } from '@screens/Reader/components/ChapterPage';
import React from 'react';

export default function usePageScale(props: ChapterPageProps) {
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
