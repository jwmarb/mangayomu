import Box from '@components/Box';
import Button from '@components/Button';
import Hyperlink from '@components/Hyperlink';
import Icon from '@components/Icon';
import Progress from '@components/Progress';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useLocalObject } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import useBoolean from '@hooks/useBoolean';
import useReaderBackgroundColor from '@hooks/useReaderBackgroundColor';
import { ChapterErrorContextState } from '@screens/Reader/components/ChapterError/ChapterError.interfaces';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import connector, { ConnectedChapterErrorProps } from './ChapterError.redux';

export const ChapterErrorContext = React.createContext<
  ChapterErrorContextState | undefined
>(undefined);
const useChapterErrorContext = () => {
  const ctx = React.useContext(ChapterErrorContext);
  if (ctx == null) throw Error('ChapterErrorContext is undefined');
  return ctx;
};

const wait = (ms: number) =>
  new Promise<void>((res) => setTimeout(() => res(), ms));

const ChapterError: React.FC<ConnectedChapterErrorProps> = (props) => {
  const { error, chapter: chapterKey } = props.error;
  const { fetchPagesByChapter, backgroundColor } = props;
  const { localRealm, availableChapters, offsetIndex, source } =
    useChapterErrorContext();
  const { background, textPrimary, textSecondary } =
    useReaderBackgroundColor(backgroundColor);
  const { width, height } = useWindowDimensions();
  const [loading, toggle] = useBoolean();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const chapter = useLocalObject(ChapterSchema, chapterKey)!;
  async function onRetryFetch() {
    if (!loading) {
      toggle(true);
      try {
        await fetchPagesByChapter({
          chapter,
          localRealm,
          availableChapters,
          offsetIndex,
          source,
          mockSuccess: true,
        });
      } finally {
        toggle(false);
      }
    }
  }
  return (
    <Stack
      space="s"
      background-color={background}
      width={width}
      height={height}
      align-items="center"
      justify-content="center"
      px="m"
      py="s"
    >
      <Icon
        type="font"
        name="wifi-cancel"
        color={textSecondary}
        size={moderateScale(128)}
      />
      <Box>
        <Text align="center" variant="header" bold color={textPrimary}>
          Failed to load chapter
        </Text>
        <Text align="center" color={textSecondary}>
          <Text bold color={textSecondary}>
            {chapter.name}
          </Text>{' '}
          {error
            ? 'gave the following error:'
            : 'threw an error but did not provide a message.'}
        </Text>
        {error && (
          <Text align="center" color="error">
            {error}
          </Text>
        )}
      </Box>
      <Stack mt="s" mx="m" space="s">
        <Button
          label="Reload chapter"
          variant="contained"
          disabled={loading}
          onPress={onRetryFetch}
          icon={loading ? <Progress size="small" /> : undefined}
        />
        <Hyperlink url={chapterKey} align="center" variant="book-title">
          Open in browser
        </Hyperlink>
      </Stack>
    </Stack>
  );
};

export default connector(React.memo(ChapterError));
