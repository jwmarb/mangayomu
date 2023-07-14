import React from 'react';
import Box from '@components/Box';
import { GestureDetector } from 'react-native-gesture-handler';
import connector, { ConnectedChapterPageProps } from './ChapterPage.redux';
import { ReadingDirection } from '@redux/slices/settings';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import usePageGestures from '@screens/Reader/components/ChapterPage/hooks/usePageGestures';
import usePageRenderer from '@screens/Reader/components/ChapterPage/hooks/usePageRenderer';
import usePageDownloader from '@screens/Reader/components/ChapterPage/hooks/usePageDownloader';

const ChapterPage: React.FC<ConnectedChapterPageProps> = (props) => {
  const { readingDirection } = useChapterPageContext();
  const { width, height } = useScreenDimensions();
  const { page: pageKey, chapter, pageNumber } = props.page;
  const { extendedPageState, backgroundColor } = props;
  const gestures = usePageGestures({ pageKey });
  const imageWidth = props.page.width;
  const imageHeight = props.page.height;
  const scale = width / imageWidth;
  const stylizedHeight = ReadingDirection.WEBTOON
    ? scale * imageHeight
    : height;
  const style = React.useMemo(
    () => ({
      width,
      height: stylizedHeight,
    }),
    [width, stylizedHeight],
  );
  const PageRenderer = usePageRenderer({
    extendedPageState,
    pageKey,
    style,
    stylizedHeight,
    backgroundColor,
  });
  usePageDownloader({ chapter, extendedPageState, pageKey, pageNumber });

  return (
    <Box
      flex-grow
      background-color={backgroundColor}
      justify-content="center"
      align-items="center"
      height={
        readingDirection !== ReadingDirection.WEBTOON ? height : undefined
      }
    >
      <GestureDetector gesture={gestures}>
        <PageRenderer />
      </GestureDetector>
    </Box>
  );
};

export default connector(React.memo(ChapterPage));
