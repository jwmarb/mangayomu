import Box, { AnimatedBox } from '@components/Box';
import Progress from '@components/Progress';
import { AnimatedStack } from '@components/Stack';
import Text from '@components/Text';
import { useLocalObject, useLocalRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { useTheme } from '@emotion/react';
import { ReaderBackgroundColor } from '@redux/slices/settings';
import {
  TransitionPageContextState,
  TransitionPageProps,
} from '@screens/Reader/components/TransitionPage/TransitionPage.interfaces';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import connector, {
  ConnectedTransitionPageProps,
} from './TransitionPage.redux';

const fetching = new Set<string>();

export const TransitionPageContext = React.createContext<
  TransitionPageContextState | undefined
>(undefined);
const useTransitionPageContext = () => {
  const ctx = React.useContext(TransitionPageContext);
  if (ctx == null)
    throw Error('TransitionPage must be a child of TransitionPageContext');
  return ctx;
};

const TransitionPage: React.FC<ConnectedTransitionPageProps> = (props) => {
  const {
    page,
    loading,
    fetchPagesByChapter,
    transitioningPageState,
    isLeadingTransitionPage,
  } = props;
  const {
    tapGesture,
    backgroundColor,
    currentChapter,
    transitionPageStyle: style,
    availableChapters,
    source,
    offsetIndex,
  } = useTransitionPageContext();
  const isPrevious = props.page.previous.index === currentChapter.index + 1;
  const isNext = props.page.next.index === currentChapter.index - 1;
  const theme = useTheme();
  const localRealm = useLocalRealm();
  const textColor = React.useMemo(() => {
    switch (backgroundColor) {
      case ReaderBackgroundColor.BLACK:
        return { custom: theme.helpers.getContrastText('#000000') };
      case ReaderBackgroundColor.WHITE:
        return { custom: theme.helpers.getContrastText('rgb(255, 255, 255)') };
      case ReaderBackgroundColor.GRAY:
        return { custom: theme.helpers.getContrastText('rgb(128,128,128)') };
    }
  }, [backgroundColor, theme]);
  const textColorSecondary = React.useMemo(() => {
    switch (backgroundColor) {
      case ReaderBackgroundColor.BLACK:
        return { custom: 'rgba(255, 255, 255, 0.7)' };
      case ReaderBackgroundColor.GRAY:
      case ReaderBackgroundColor.WHITE:
        return { custom: 'rgba(0, 0, 0, 0.6)' };
    }
  }, []);
  const { width, height } = useWindowDimensions();
  const previous = useLocalObject(ChapterSchema, page.previous._id);
  const next = useLocalObject(ChapterSchema, page.next._id);
  React.useEffect(() => {
    (async () => {
      if (
        isLeadingTransitionPage &&
        next != null &&
        !fetching.has(next._id) &&
        !transitioningPageState?.alreadyFetched &&
        !transitioningPageState?.loading
      ) {
        fetching.add(next._id);

        try {
          await fetchPagesByChapter({
            chapter: next,
            source,
            offsetIndex,
            availableChapters,
            localRealm,
          });
        } finally {
          fetching.delete(next._id);
        }
      }
    })();
  }, []);
  return (
    <GestureDetector gesture={tapGesture}>
      <AnimatedStack
        space="s"
        style={style}
        width={width}
        height={height}
        justify-content="center"
        align-items="center"
        px="m"
        py="s"
      >
        {loading && <Progress />}
        {isNext && (
          <>
            <Text color={textColorSecondary}>
              <Text color={textColor} bold>
                Next:
              </Text>{' '}
              {next?.name}
            </Text>
            <Text color={textColorSecondary}>
              <Text color={textColor} bold>
                Current:
              </Text>{' '}
              {currentChapter.name}
            </Text>
          </>
        )}
        {isPrevious && (
          <>
            <Text color={textColorSecondary}>
              <Text color={textColor} bold>
                Current:
              </Text>{' '}
              {currentChapter.name}
            </Text>
            <Text color={textColorSecondary}>
              <Text color={textColor} bold>
                Previous:
              </Text>{' '}
              {previous?.name}
            </Text>
          </>
        )}
      </AnimatedStack>
    </GestureDetector>
  );
};

export default connector(React.memo(TransitionPage));
