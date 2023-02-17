import Box from '@components/Box';
import SelectItem from '@components/Filters/SelectItem';
import { useManga } from '@database/schemas/Manga';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import React from 'react';
import { ListRenderItem } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { LanguageProps } from './Language.interfaces';

const Language: React.FC<LanguageProps> = (props) => {
  const { selectedLanguage, supportedLanguages, mangaLink } = props;
  const { update } = useManga(mangaLink);
  const handleOnChange = React.useCallback(
    (i: ISOLangCode | 'Use default language') => {
      update((obj) => {
        obj.selectedLanguage = i;
      });
    },
    [update],
  );
  const renderItem = React.useCallback<
    ListRenderItem<ISOLangCode | 'Use default language'>
  >(
    ({ item }) => (
      <SelectItem
        isSelected={selectedLanguage === item}
        title={
          item in languages
            ? `${languages[item as ISOLangCode].name} (${
                languages[item as ISOLangCode].nativeName
              })`
            : item
        }
        itemKey={item}
        onChange={handleOnChange}
      />
    ),
    [selectedLanguage, handleOnChange],
  );
  const data = React.useMemo(
    () => ['Use default language', ...supportedLanguages],
    [supportedLanguages],
  ) as (ISOLangCode | 'Use default language')[];
  return (
    <BottomSheetFlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListFooterComponent={<Box mb={moderateScale(100)} />}
    />
  );
};

const keyExtractor = (i: ISOLangCode | 'Use default language') => i;

export default Language;
