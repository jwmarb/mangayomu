import React from 'react';
import { View } from 'react-native';
import Screen from '@/components/primitives/Screen';
import Text from '@/components/primitives/Text';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';

export default function Explore() {
  const collapsible = useCollapsibleHeader({
    title: 'Explore',
  });
  return (
    <Screen collapsible={collapsible}>
      <Text>Hello from Explore</Text>
      <View style={{ height: 2000 }} />
    </Screen>
  );
}
