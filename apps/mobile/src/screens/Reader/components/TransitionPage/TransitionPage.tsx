import Box from '@components/Box';
import Progress from '@components/Progress';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useLocalRealm } from '@database/main';
import useReaderBackgroundColor from '@hooks/useReaderBackgroundColor';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { TransitionPageContextState, TransitionPageProps } from './';
import React from 'react';
import { GestureDetector } from 'react-native-gesture-handler';

import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import useAppSelector from '@hooks/useAppSelector';

export const TransitionPageContext = React.createContext<
  TransitionPageContextState | undefined
>(undefined);
const useTransitionPageContext = () => {
  const ctx = React.useContext(TransitionPageContext);
  if (ctx == null)
    throw Error('TransitionPage must be a child of TransitionPageContext');
  return ctx;
};

const TransitionPage: React.FC<TransitionPageProps> = (props) => {
  const { page } = props;
  const loading = useAppSelector((state) => state.reader.loading);
  const { tapGesture, currentChapter } = useTransitionPageContext();
  const { background, textPrimary, textSecondary } = useReaderBackgroundColor();
  const localRealm = useLocalRealm();
  const isPrevious = props.page.next.index === currentChapter.index;
  const isNext = props.page.previous.index === currentChapter.index;

  const { width, height } = useScreenDimensions();
  const previous = localRealm.objectForPrimaryKey(
    LocalChapterSchema,
    page.previous._id,
  );
  const next = localRealm.objectForPrimaryKey(
    LocalChapterSchema,
    page.next._id,
  );

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
        </Stack>
      </GestureDetector>
    </Box>
  );
};

export default React.memo(TransitionPage);
