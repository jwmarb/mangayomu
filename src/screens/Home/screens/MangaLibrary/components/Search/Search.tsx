import { Flex, Icon, IconButton, Spacer, TextField, Typography } from '@components/core';
import { HeaderBuilder, MangaSource } from '@components/Screen/Header/Header.base';
import { SearchProps } from '@screens/Home/screens/MangaLibrary/components/Search/Search.interfaces';
import React from 'react';

const Search: React.FC<SearchProps> = React.forwardRef((props, ref) => {
  const { setQuery, additionalButtons, setShowSearchBar, showSearchBar } = props;

  function handleOnShowSearch() {
    setShowSearchBar(true);
  }

  function handleOnHideSearch() {
    setShowSearchBar(false);
  }

  return (
    <HeaderBuilder horizontalPadding paper>
      <Flex shrink alignItems='center'>
        {showSearchBar ? (
          <>
            <IconButton icon={<Icon bundle='Feather' name='arrow-left' />} onPress={handleOnHideSearch} />
            <Spacer x={1} />
            <TextField placeholder='Search for a title' ref={ref} onChangeText={setQuery} />
          </>
        ) : (
          <>
            <MangaSource />
            <Spacer x={1} />
            <Typography variant='subheader'>Library</Typography>
          </>
        )}
      </Flex>
      <Flex spacing={1} grow justifyContent='flex-end' alignItems='center'>
        {!showSearchBar && <IconButton icon={<Icon bundle='Feather' name='search' />} onPress={handleOnShowSearch} />}
        {additionalButtons}
      </Flex>
    </HeaderBuilder>
  );
});

export default React.memo(Search);
