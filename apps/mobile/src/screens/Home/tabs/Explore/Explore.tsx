import React from 'react';
import { View } from 'react-native';
import Screen from '@/components/primitives/Screen';
import Text from '@/components/primitives/Text';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { HomeStackProps } from '@/screens/Home/Home';
import IconButton from '@/components/primitives/IconButton';
import Icon from '@/components/primitives/Icon';

export default function Explore(props: HomeStackProps<'Explore'>) {
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
