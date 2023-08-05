import Box from '@components/Box';
import Button from '@components/Button';
import Hyperlink from '@components/Hyperlink';
import Icon from '@components/Icon';
import Progress from '@components/Progress';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useRealm } from '@database/main';
import useBoolean from '@hooks/useBoolean';
import useReaderBackgroundColor from '@hooks/useReaderBackgroundColor';
import useScreenDimensions from '@hooks/useScreenDimensions';
import { ChapterErrorContextState, ChapterErrorProps } from './';
import React from 'react';
import { moderateScale } from 'react-native-size-matters';
import NetInfo, {
  NetInfoSubscription,
  useNetInfo,
} from '@react-native-community/netinfo';
import { LocalChapterSchema } from '@database/schemas/LocalChapter';

export const ChapterErrorContext = React.createContext<
  ChapterErrorContextState | undefined
>(undefined);
const useChapterErrorContext = () => {
  const ctx = React.useContext(ChapterErrorContext);
  if (ctx == null) throw Error('ChapterErrorContext is undefined');
  return ctx;
};

const ChapterError: React.FC<ChapterErrorProps> = (props) => {
  const { data } = props;
  const { error, current } = data;
  const localRealm = useRealm();
  const chapter = localRealm.objectForPrimaryKey(
    LocalChapterSchema,
    current._id,
  );
  const fetchPages = useChapterErrorContext();
  const { background, textPrimary, textSecondary } = useReaderBackgroundColor();
  const { width, height } = useScreenDimensions();
  const [loading, toggle] = useBoolean();
  const netInfo = useNetInfo();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  React.useEffect(() => {
    if (loading && chapter != null) {
      let p: ReturnType<typeof fetchPages>;
      const listener: NetInfoSubscription = NetInfo.addEventListener(
        ({ isInternetReachable }) => {
          if (isInternetReachable) p = fetchPages(chapter);
          else toggle(false);
        },
      );
      return () => {
        listener();
        p?.abort();
      };
    }
  }, [loading]);
  async function onRetryFetch() {
    if (!loading) toggle(true);
  }
  return (
    <Box background-color={background}>
      <Stack
        space="s"
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
              {chapter?.name ?? current._id}
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
            disabled={loading || !netInfo.isInternetReachable}
            onPress={onRetryFetch}
            icon={loading ? <Progress size="small" /> : undefined}
          />
          {chapter != null && (
            <Hyperlink url={chapter._id} align="center" variant="book-title">
              Open in browser
            </Hyperlink>
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default React.memo(ChapterError);
