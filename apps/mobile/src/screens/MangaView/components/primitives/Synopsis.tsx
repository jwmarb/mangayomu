import React from 'react';
import { View } from 'react-native';
import { useMangaViewFetchStatus } from '@/screens/MangaView/context';
import Text from '@/components/primitives/Text';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import Button from '@/components/primitives/Button';
import Icon from '@/components/primitives/Icon';
import {
  SynopsisExpandedProvider,
  useMangaViewError,
} from '@/screens/MangaView/context';
import { getErrorMessage } from '@/utils/helpers';
const HTMLRenderer = React.lazy(
  () => import('@/screens/MangaView/components/renderers/HTMLRenderer'),
);

const styles = createStyles((theme) => ({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: theme.style.size.m,
  },
}));

export type SynopsisProps = {
  description?: string | null;
};

export default React.memo(function Synopsis(props: SynopsisProps) {
  const status = useMangaViewFetchStatus();
  const error = useMangaViewError();
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [showExpanded, setShowExpanded] = React.useState<boolean>(false);
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const { description } = props;

  function handleOnPress() {
    setExpanded((prev) => !prev);
  }

  return (
    <View>
      <View style={style.header}>
        <Text variant="h4" bold>
          Synopsis
        </Text>
        {showExpanded && (
          <Button
            title="Expand"
            onPress={handleOnPress}
            icon={
              <Icon
                type="icon"
                name={expanded ? 'chevron-down' : 'chevron-up'}
              />
            }
            iconPlacement="right"
          />
        )}
      </View>
      {description != null && (
        <SynopsisExpandedProvider value={expanded}>
          <React.Suspense
            fallback={
              <>
                <Text.Skeleton />
                <Text.Skeleton />
                <Text.Skeleton />
                <Text.Skeleton />
                <Text.Skeleton />
                <Text.Skeleton />
              </>
            }
          >
            <HTMLRenderer
              data={description}
              isExpanded={expanded}
              setShowExpanded={setShowExpanded}
            />
          </React.Suspense>
        </SynopsisExpandedProvider>
      )}
      {(status === 'idle' || status === 'paused') && description == null && (
        <Text color="textSecondary" italic>
          No synopsis available.
        </Text>
      )}
      {status === 'fetching' && (
        <>
          <Text.Skeleton />
          <Text.Skeleton />
          <Text.Skeleton />
          <Text.Skeleton />
          <Text.Skeleton />
          <Text.Skeleton />
        </>
      )}
      {status === 'idle' && error != null && description == null && (
        <Text color="error">{getErrorMessage(error)}</Text>
      )}
    </View>
  );
});
