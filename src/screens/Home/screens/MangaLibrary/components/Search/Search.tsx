import { Flex, Icon, IconButton, Spacer, TextField, Typography } from '@components/core';
import { HeaderBuilder, MangaSource } from '@components/Screen/Header/Header.base';
import { SearchProps } from '@screens/Home/screens/MangaLibrary/components/Search/Search.interfaces';
import React from 'react';

const Search: React.FC<SearchProps> = React.forwardRef((props, ref) => {
  const { showSearch, onToggleSearch, onExpand, setQuery } = props;
  return (
    <HeaderBuilder horizontalPadding paper>
      <Flex shrink alignItems='center'>
        {showSearch ? (
          <>
            <IconButton icon={<Icon bundle='Feather' name='arrow-left' />} onPress={onToggleSearch} />
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
        {!showSearch && <IconButton icon={<Icon bundle='Feather' name='search' />} onPress={onToggleSearch} />}
        <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='filter-menu' />} onPress={onExpand} />
      </Flex>
    </HeaderBuilder>
  );
});

export default React.memo(Search);
