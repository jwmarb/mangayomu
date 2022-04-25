import { Icon, IconButton } from '@components/core';
import useLazyLoading from '@hooks/useLazyLoading';
import useSearchBar from '@hooks/useSearchBar';
import useStatefulHeader from '@hooks/useStatefulHeader';
import { RootStackParamList } from '@navigators/Root/Root.interfaces';
import { StackScreenProps } from '@react-navigation/stack';
import { useMangaSource } from '@services/scraper';
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
  const [filter, setFilter] = React.useState<FilterState>(schema);
  const { ready, Fallback } = useLazyLoading();

  if (ready)
    return (
      <>
        <FilterModal show={show} onClose={handleOnCloseFilters} setFilterState={setFilter} />
      </>
    );

  return Fallback;
};

export default MangaBrowser;
