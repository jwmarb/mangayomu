import Box from '@components/Box';
import SelectItem from '@components/Filters/SelectItem';
import { MangaSchema } from '@database/schemas/Manga';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import React from 'react';
import { ListRenderItem } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { LanguageProps } from './Language.interfaces';
import { useRealm } from '@database/main';

const Language: React.FC<LanguageProps> = (props) => {
  const { selectedLanguage, supportedLanguages, mangaLink } = props;
  const localRealm = useRealm();
  const handleOnChange = React.useCallback(
    (i: ISOLangCode | 'Use default language') => {
      const mangas = localRealm
        .objects(MangaSchema)
        .filtered('link = $0', mangaLink);
      if (mangas.length > 0) {
        const obj = mangas[0];
        localRealm.write(() => {
          obj.selectedLanguage = i;
        });
      }
    },
    [localRealm, mangaLink],
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
