import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import { HomeStackProps } from '@/screens/Home/Home';

export default function Library(props: HomeStackProps<'Library'>) {
  const collapsible = useCollapsibleHeader({
    title: 'Library',
  });
  return (
    <Screen.FlatList
      collapsible={collapsible}
      data={[]}
      renderItem={() => null}
    />
  );
}
