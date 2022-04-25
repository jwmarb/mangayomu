import { Icon, IconButton } from '@components/core';
import useLazyLoading from '@hooks/useLazyLoading';
import useSearchBar from '@hooks/useSearchBar';
import useStatefulHeader from '@hooks/useStatefulHeader';
import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import useMangaSource from '@hooks/useMangaSource';
import { MangaHostWithFilters } from '@services/scraper/scraper.filters';
import { FilterState } from '@utils/MangaFilters/schema';
import React from 'react';

const MangaBrowser: React.FC<StackScreenProps<RootStackParamList, 'MangaBrowser'>> = (props) => {
  const {
    navigation,
    route: {
      params: { mangas, source, initialQuery },
    },
  } = props;
  const mangahost = useMangaSource(source) as MangaHostWithFilters<Record<string, unknown>>;
  const handleOnExitSearch = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);
  const [show, setShow] = React.useState<boolean>(false);
  function handleOnShowFilters() {
    setShow(true);
  }
  function handleOnCloseFilters() {
    setShow(false);
  }
  const { query, header } = useSearchBar({
    title: source,
    initialQuery,
    alwaysShowSearchBar: true,
    onExitSearch: handleOnExitSearch,
    additionalButtons: <IconButton icon={<Icon bundle='Feather' name='filter' />} onPress={handleOnShowFilters} />,
  });
  useStatefulHeader(header);
  const { FilterModal, schema } = mangahost.getFilterSchema();
  const { ready, Fallback } = useLazyLoading();
  async function handleOnApplyFilter(state: typeof schema) {
    const mangas = await mangahost.search(query, state);
  }

  if (ready)
    return (
      <>
        <FilterModal show={show} onClose={handleOnCloseFilters} onApplyFilter={handleOnApplyFilter} />
      </>
    );

  return Fallback;
};

export default MangaBrowser;
