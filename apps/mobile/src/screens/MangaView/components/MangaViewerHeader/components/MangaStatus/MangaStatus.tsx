import Stack from '@components/Stack';
import Text from '@components/Text';
import { useTheme } from '@emotion/react';
import React from 'react';
import { MangaStatusProps } from './';
import { moderateScale } from 'react-native-size-matters';
import { useMangaViewError } from '@screens/MangaView/context/ErrorContext';

const ongoingSet = new Set(['ongoing', 'publishing']);

const discontinuedSet = new Set(['discontinued', 'canceled', 'cancelled']);

const hiatusSet = new Set(['hiatus', 'on hiatus']);

const completedSet = new Set(['finished', 'complete', 'completed']);

const MangaStatus: React.FC<MangaStatusProps> = (props) => {
  const { data, loading } = props;
  const theme = useTheme();
  const error = useMangaViewError();

  function getColor(status: string) {
    if (ongoingSet.has(status)) return theme.palette.status.ongoing;
    if (discontinuedSet.has(status)) return theme.palette.status.discontinued;
    if (hiatusSet.has(status)) return theme.palette.status.hiatus;
    if (completedSet.has(status)) return theme.palette.status.completed;
    return theme.palette.text.primary;
  }

  function getReadableStatus(status: string) {
    if (ongoingSet.has(status)) return 'Ongoing';
    if (discontinuedSet.has(status)) return 'Cancelled';
    if (hiatusSet.has(status)) return 'Hiatus';
    if (completedSet.has(status)) return 'Completed';
    return 'Unknown';
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
          <Text color={getColor(data.scan)}>
            {getReadableStatus(data.scan)}
          </Text>
        ) : loading ? (
          <Text.Skeleton lineStyles={[{ width: moderateScale(72) }]} />
        ) : (
          <Text color="disabled">---</Text>
        )}
      </Stack>
      <Stack
        flex-direction="row"
        space="s"
        justify-content="space-between"
        align-items="center"
      >
        <Text color="textSecondary">Publish Status</Text>
        {!error ? (
          data && data.publish ? (
            <Text color={getColor(data.publish)}>
              {getReadableStatus(data.publish)}
            </Text>
          ) : (
            <Text.Skeleton lineStyles={[{ width: moderateScale(72) }]} />
          )
        ) : (
          <Text color="disabled">---</Text>
        )}
      </Stack>
    </>
  );
};

export default React.memo(MangaStatus);
