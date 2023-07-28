import Text from '@app/components/Text';
import { WithStatus } from '@mangayomu/mangascraper';
import React from 'react';

type StatusProps = Partial<WithStatus> & {
  loading: boolean;
};

const ongoingSet = new Set(['ongoing', 'publishing']);

const discontinuedSet = new Set(['discontinued', 'canceled', 'cancelled']);

const hiatusSet = new Set(['hiatus', 'on hiatus']);

const completedSet = new Set(['finished', 'complete', 'completed']);

function getColor(status: string) {
  const parsed = status.substring(0, status.lastIndexOf(' ')).toLowerCase();
  if (ongoingSet.has(parsed)) return 'dark:text-green-500 text-green-600';
  if (discontinuedSet.has(parsed)) 'dark:text-red-500 text-red-600';
  if (hiatusSet.has(parsed)) return 'dark:text-amber-500 text-amber-600';
  if (completedSet.has(parsed)) return 'dark:text-stone-500 text-stone-600';
  return 'text-text-primary';
}

export default function Status(props: StatusProps) {
  const { status, loading } = props;
  return (
    <>
      <div className="flex flex-row justify-between gap-2">
        <Text color="text-secondary">Scan Status</Text>
        {loading ? (
          <div>
            <Text.Skeleton
              className="text-disabled font-medium"
              text={['Unknown']}
            />
          </div>
        ) : status?.scan ? (
          <Text className={`${getColor(status.scan)} font-medium`}>
            {status.scan.substring(0, status.scan.indexOf(' '))}
          </Text>
        ) : (
          <Text className="text-disabled font-medium">Unknown</Text>
        )}
      </div>
      <div className="flex flex-row justify-between gap-2">
        <Text color="text-secondary">Publish Status</Text>
        {loading ? (
          <div>
            <Text.Skeleton
              className="text-disabled font-medium"
              text={['Unknown']}
            />
          </div>
        ) : status?.publish ? (
          <Text className={`${getColor(status.publish)} font-medium`}>
            {status.publish.substring(0, status.publish.indexOf(' '))}
          </Text>
        ) : (
          <Text className="text-disabled font-medium">Unknown</Text>
        )}
      </div>
    </>
  );
}
