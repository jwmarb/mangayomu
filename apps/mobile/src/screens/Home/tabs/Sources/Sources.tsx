import React from 'react';
import { View } from 'react-native';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import Text from '@/components/primitives/Text';

type MangaSourceListItem = { name: string } | string;

export default function Sources() {
  const collapsible = useCollapsibleHeader({ title: 'Sources' });
  return (
    <Screen collapsible={collapsible}>
      <Text variant="h4">Pinned Sources</Text>
      <Text variant="h4">All Sources</Text>
      <View style={{ height: 2000 }} />
    </Screen>
  );
}
