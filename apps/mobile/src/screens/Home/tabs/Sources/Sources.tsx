import React from 'react';
import { View } from 'react-native';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';

export default function Sources() {
  const collapsible = useCollapsibleHeader({ title: 'Sources' });
  return (
    <Screen collapsible={collapsible}>
      <View style={{ height: 2000 }} />
    </Screen>
  );
}
