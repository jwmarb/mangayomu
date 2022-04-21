import { Screen, Container, Typography, IconButton, Icon, Spacer, TextField, Flex } from '@components/core';
import { FlatListScreen } from '@components/core';
import { HeaderBuilder, MangaSource } from '@components/Screen/Header/Header.base';
import { TextFieldProps } from '@components/TextField/TextField.interfaces';
import useLazyLoading from '@hooks/useLazyLoading';
import { useFocusEffect } from '@react-navigation/native';
import { keyExtractor, renderItem } from '@screens/Home/screens/MangaLibrary/MangaLibrary.flatlist';
import connector, { MangaLibraryProps } from '@screens/Home/screens/MangaLibrary/MangaLibrary.redux';
import { titleIncludes } from '@utils/MangaFilters';
import pixelToNumber from '@utils/pixelToNumber';
import React from 'react';
import { NativeSyntheticEvent, TextInput, TextInputSubmitEditingEventData } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import { useCollapsibleHeader, UseCollapsibleOptions } from 'react-navigation-collapsible';
import { useTheme } from 'styled-components/native';

const Spacing = () => <Spacer y={4} />;
const MangaLibrary: React.FC<MangaLibraryProps> = (props) => {
  const { mangas, navigation } = props;
  const [showSearch, setShowSearch] = React.useState<boolean>(false);
  const { ready, Fallback } = useLazyLoading();
  const [query, setQuery] = React.useState<string>('');
  const theme = useTheme();
  const textRef = React.useRef<TextInput>();
  const handleToggleSearch = React.useCallback(() => {
    setShowSearch((prev) => !prev);
  }, [setShowSearch]);
  const handleOnSubmitEditing = React.useCallback(
    (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
      console.log(`searching for: ${e.nativeEvent.text}`);
    },
    [query]
  );

  const header = React.useCallback(
    () => (
      <HeaderBuilder horizontalPadding paper>
        <Flex shrink alignItems='center'>
          {showSearch ? (
            <>
              <IconButton icon={<Icon bundle='Feather' name='arrow-left' />} onPress={handleToggleSearch} />
              <Spacer x={1} />
              <TextField
                placeholder='Search for a title'
                ref={textRef}
                onChangeText={setQuery}
                onSubmitEditing={handleOnSubmitEditing}
              />
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
          {!showSearch && <IconButton icon={<Icon bundle='Feather' name='search' />} onPress={handleToggleSearch} />}
          <IconButton icon={<Icon bundle='MaterialCommunityIcons' name='sort' />} />
        </Flex>
      </HeaderBuilder>
    ),
    [showSearch, setQuery, handleToggleSearch, handleOnSubmitEditing]
  );

  React.useEffect(() => {
    navigation.setOptions({
      headerTitle: '',
      header: header,
    });
    setTimeout(() => {
      if (showSearch) textRef.current?.focus();
      else setQuery('');
    }, 100);
  }, [showSearch]);

  if (!ready) return Fallback;

  return (
    <FlatList
      contentContainerStyle={{ paddingVertical: pixelToNumber(theme.spacing(3)) }}
      columnWrapperStyle={{ justifyContent: 'space-around' }}
      ItemSeparatorComponent={Spacing}
      numColumns={2}
      renderItem={renderItem}
      data={mangas.filter(({ manga }) => titleIncludes(query)(manga))}
      keyExtractor={keyExtractor}
    />
  );
};

export default connector(MangaLibrary);
