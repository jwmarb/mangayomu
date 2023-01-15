import { Icon, ListItem } from '@components/core';
import { LanguageItemProps } from '@screens/MangaViewer/components/ChapterHeader/components/LanguageItem/LanguageItem.interfaces';
import React from 'react';
import { View } from 'react-native';
import { languages } from '@utils/languageCodes';

const LanguageItem: React.FC<LanguageItemProps> = (props) => {
  const { selected, isoCode, onSelect } = props;
  function handleOnPress() {
    onSelect(isoCode);
  }

  return (
    <ListItem
      title={languages[isoCode].name}
      typographyProps={{ color: selected ? 'primary' : 'textPrimary' }}
      onPress={handleOnPress}
      adornment={
        selected ? (
          <Icon bundle='Feather' name='check' color='primary' />
        ) : (
          <View style={{ opacity: 0 }}>
            <Icon bundle='Feather' name='check' color='primary' />
          </View>
        )
      }
    />
  );
};

export default React.memo(LanguageItem);
