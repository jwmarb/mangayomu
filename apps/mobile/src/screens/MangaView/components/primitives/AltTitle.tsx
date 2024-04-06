import React from 'react';
import Text from '@/components/primitives/Text';
import useMangaViewFetchStatus from '@/screens/MangaView/hooks/useMangaViewFetchStatus';

export type AltTitleProps = {
  title?: string[];
};

export default function AltTitle(props: AltTitleProps) {
  const { title } = props;
  const status = useMangaViewFetchStatus();

  if (status === 'pending') {
    return <Text.Skeleton variant="body2" />;
  }

  if (title == null) return null;

  return (
    <Text variant="body2" color="textSecondary" numberOfLines={2}>
      {title?.join(' · ')}
    </Text>
  );
}
