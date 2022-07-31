import Progress from '@components/Progress';
import Spacer from '@components/Spacer';
import { Typography } from '@components/Typography';
import { TransitioningPageContainer } from '@screens/Reader/components/TransitioningPage/TransitioningPage.base';
import connector, {
  ConnectedTransitioningPageProps,
} from '@screens/Reader/components/TransitioningPage/TransitioningPage.redux';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const TransitioningPage: React.FC<ConnectedTransitioningPageProps> = (props) => {
  const {
    currentChapterInView,
    readingDirection,
    previousChapter,
    nextChapter,
    loading,
    setReaderLoading,
    extendedStateKey,
    hasAlreadyFetched,
    fetchChapter,
    shouldFetch,
    toggleOverlay,
  } = props;
  React.useEffect(() => {
    if (currentChapterInView && !hasAlreadyFetched && shouldFetch) {
      if (currentChapterInView.link === nextChapter.link) {
        console.log(`fetching chapter for ${previousChapter.name}`);
        fetchChapter(previousChapter, extendedStateKey, 'start');
      }
      if (currentChapterInView.link === previousChapter.link) {
        console.log(`fetching chapter for ${nextChapter.name}`);
        fetchChapter(nextChapter, extendedStateKey, 'end');
      }
    }
  }, [shouldFetch]);
  const tapGesture = React.useMemo(() => Gesture.Tap().onEnd(toggleOverlay), [toggleOverlay]);
  const { width, height } = useWindowDimensions();
  return (
    <GestureDetector gesture={tapGesture}>
      <TransitioningPageContainer readingDirection={readingDirection} width={width} height={height}>
        {currentChapterInView && (
          <>
            {currentChapterInView.link === nextChapter.link && (
              <>
                <Typography bold>
                  Current:{' '}
                  <Typography color='textSecondary'>
                    {currentChapterInView.name ?? `Chapter ${currentChapterInView.index + 1}`}
                  </Typography>
                </Typography>
                <Typography bold>
                  Previous:{' '}
                  <Typography color='textSecondary'>
                    {previousChapter.name ?? `Chapter ${previousChapter.index + 1}`}
                  </Typography>
                </Typography>
              </>
            )}
            {currentChapterInView.link === previousChapter.link && (
              <>
                <Typography bold>
                  Current:{' '}
                  <Typography color='textSecondary'>
                    {currentChapterInView.name ?? `Chapter ${currentChapterInView.index + 1}`}
                  </Typography>
                </Typography>
                <Typography bold>
                  Next:{' '}
                  <Typography color='textSecondary'>
                    {nextChapter.name ?? `Chapter ${nextChapter.index + 1}`}
                  </Typography>
                </Typography>
              </>
            )}
          </>
        )}
        {loading && (
          <>
            <Spacer y={2} />
            <Progress />
          </>
        )}
      </TransitioningPageContainer>
    </GestureDetector>
  );
};

export default connector(React.memo(TransitioningPage));
