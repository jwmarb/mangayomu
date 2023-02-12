import Progress from '@components/Progress';
import Skeleton from '@components/Skeleton';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import React from 'react';
import { MangaStatusProps } from './MangaStatus.interfaces';

const ongoingSet = new Set(['ongoing', 'publishing']);

const discontinuedSet = new Set(['discontinued', 'canceled', 'cancelled']);

const hiatusSet = new Set(['hiatus', 'on hiatus']);

const completedSet = new Set(['finished', 'complete', 'completed']);

const MangaStatus: React.FC<MangaStatusProps> = (props) => {
  const { data, loading } = props;
  const theme = useTheme();

  function getColor(status: string) {
    const parsed = status.substring(0, status.lastIndexOf(' ')).toLowerCase();
    if (ongoingSet.has(parsed)) return theme.palette.status.ongoing;
    if (discontinuedSet.has(parsed)) return theme.palette.status.discontinued;
    if (hiatusSet.has(parsed)) return theme.palette.status.hiatus;
    if (completedSet.has(parsed)) return theme.palette.status.completed;
    return theme.palette.text.primary;
  }

  return (
    <>
      <Stack
        flex-direction="row"
        space="s"
        justify-content="space-between"
        align-items="center"
      >
        <Text color="textSecondary">Scan Status</Text>
        {data && data.scan ? (
          <Text color={{ custom: getColor(data.scan) }}>
            {data.scan.substring(0, data.scan.indexOf(' '))}
          </Text>
        ) : loading ? (
          <Skeleton>
            <Text>Ongoing</Text>
          </Skeleton>
        ) : (
          <Text color="disabled">Unknown</Text>
        )}
      </Stack>
      <Stack
        flex-direction="row"
        space="s"
        justify-content="space-between"
        align-items="center"
      >
        <Text color="textSecondary">Publish Status</Text>
        {data && data.publish ? (
          <Text color={{ custom: getColor(data.publish) }}>
            {data.publish.substring(0, data.publish.lastIndexOf(' '))}
          </Text>
        ) : (
          <Skeleton>
            <Text>Ongoing</Text>
          </Skeleton>
        )}
      </Stack>
    </>
  );
};

export default React.memo(MangaStatus);
