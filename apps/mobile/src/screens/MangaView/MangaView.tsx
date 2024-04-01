import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import useManga from '@/hooks/useManga';
import useMangaSource from '@/hooks/useMangaSource';
import { RootStackProps } from '@/screens/navigator';

export default function MangaView(props: RootStackProps<'MangaView'>) {
  const {
    navigation,
    route: {
      params: { manga: unparsedManga, source: sourceStr },
    },
  } = props;
  // const source = useMangaSource(sourceStr ?? unparsedManga.__source__);
  // const manga = useManga(unparsedManga);
  // const collapsible = useCollapsibleHeader({ title: })
  return <Screen.FlatList data={[]} renderItem={() => null} />;
}
