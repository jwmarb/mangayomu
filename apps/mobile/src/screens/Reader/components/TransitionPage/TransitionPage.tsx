import Box, { AnimatedBox } from '@components/Box';
import Progress from '@components/Progress';
import Stack, { AnimatedStack } from '@components/Stack';
import Text from '@components/Text';
import { useLocalObject, useLocalRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { useTheme } from '@emotion/react';
import useReaderBackgroundColor from '@hooks/useReaderBackgroundColor';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { ReaderBackgroundColor } from '@redux/slices/settings';
import {
  TransitionPageContextState,
  TransitionPageProps,
} from '@screens/Reader/components/TransitionPage/TransitionPage.interfaces';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
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
  const { page, loading } = props;
  const { tapGesture, backgroundColor, currentChapter, showTransitionPage } =
    useTransitionPageContext();
  const { background, textPrimary, textSecondary } =
    useReaderBackgroundColor(backgroundColor);
  const isPrevious = props.page.previous.index > currentChapter.index;
  const isNext = props.page.next.index < currentChapter.index;

  const { width, height } = useScreenDimensions();
  const previous = useLocalObject(ChapterSchema, page.previous._id);
  const next = useLocalObject(ChapterSchema, page.next._id);

  return (
    <Box background-color={background}>
      <GestureDetector gesture={tapGesture}>
        <Stack
          space="s"
          // style={style}
          width={width}
          height={height}
          justify-content="center"
          align-items="center"
          px="m"
          py="s"
        >
          {showTransitionPage && (
            <>
              {loading && <Progress />}
              {isNext && (
                <>
                  <Text color={textSecondary}>
                    <Text color={textPrimary} bold>
                      Next:
                    </Text>{' '}
                    {next?.name}
                  </Text>
                  <Text color={textSecondary}>
                    <Text color={textPrimary} bold>
                      Current:
                    </Text>{' '}
                    {currentChapter.name}
                  </Text>
                </>
              )}
              {isPrevious && (
                <>
                  <Text color={textSecondary}>
                    <Text color={textPrimary} bold>
                      Current:
                    </Text>{' '}
                    {currentChapter.name}
                  </Text>
                  <Text color={textSecondary}>
                    <Text color={textPrimary} bold>
                      Previous:
                    </Text>{' '}
                    {previous?.name}
                  </Text>
                </>
              )}
            </>
          )}
        </Stack>
      </GestureDetector>
    </Box>
  );
};

export default connector(React.memo(TransitionPage));
