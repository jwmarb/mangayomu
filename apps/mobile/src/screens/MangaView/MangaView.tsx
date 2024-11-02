import React from 'react';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import useManga from '@/hooks/useManga';
import useMangaSource from '@/hooks/useMangaSource';
import { RootStackProps } from '@/screens/navigator';
import { styles } from '@/screens/MangaView/styles';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import headerLeft from '@/screens/MangaView/components/ui/header/headerLeft';
import HeaderRight from '@/screens/MangaView/components/ui/header/headerRight';
import BottomSheet from '@/components/composites/BottomSheet';
import useMangaMeta from '@/screens/MangaView/hooks/useMangaMeta';
import useChapters from '@/screens/MangaView/hooks/useChapters';
import MangaViewProvider from '@/screens/MangaView/providers';
import { CodeSplitter } from '@/utils/codeSplit';
const FilterMenu = React.lazy(
  () => import('@/screens/MangaView/components/composites/FilterMenu'),
);
const MangaViewMain = React.lazy(
  () => import('@/screens/MangaView/components/ui/main'),
);

export default function MangaView(props: RootStackProps<'MangaView'>) {
  const {
    route: {
      params: { manga: unparsedManga, source: sourceStr },
    },
  } = props;
  const source = useMangaSource({ manga: unparsedManga, source: sourceStr });
  const manga = useManga(unparsedManga, source);
  const { data, isFetching } = useMangaMeta(unparsedManga, sourceStr);
  const [unparsed, meta] = data ?? [];
  const { chapters, onEndReached } = useChapters(manga, meta, unparsed);
  const bottomSheet = React.useRef<BottomSheet>(null);
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const collapsible = useCollapsibleHeader(
    {
      showHeaderCenter: false,
      showBackButton: false,
      headerRightStyle: style.headerRight,
      headerLeft,
      headerRight: (props) => <HeaderRight {...props} manga={manga} />,
      loading: isFetching,
    },
    [isFetching, manga],
  );

  return (
    <MangaViewProvider
      bottomSheet={bottomSheet}
      source={sourceStr}
      unparsedManga={unparsedManga}
      chapters={chapters}
    >
      <CodeSplitter>
        <MangaViewMain
          chapters={chapters}
          onEndReached={onEndReached}
          source={sourceStr}
          collapsible={collapsible}
        />
      </CodeSplitter>
      {/* DO NOT UNCOMMENT UNTIL `react-native-tab-view` fixes crashing! */}
      {/* <React.Suspense fallback={null}>
        <FilterMenu ref={bottomSheet} />
      </React.Suspense> */}
    </MangaViewProvider>
  );
}
