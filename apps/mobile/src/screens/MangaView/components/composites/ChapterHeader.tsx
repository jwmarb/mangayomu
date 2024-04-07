import { View } from 'react-native';
import React from 'react';
import Icon from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useMangaViewData from '@/screens/MangaView/hooks/useMangaViewData';
import { styles } from '@/screens/MangaView/styles';
import useOpenFilterMenu from '@/screens/MangaView/hooks/useOpenFilterMenu';

export default function ChapterHeader() {
  const data = useMangaViewData();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const handleOnPress = useOpenFilterMenu();

  return (
    <>
      <View style={style.chapterHeader}>
        <Text variant="h4" bold>
          {data?.chapters.length} Chapters
        </Text>
        <IconButton
          onPress={handleOnPress}
          icon={<Icon type="icon" name="filter-menu" />}
        />
      </View>
    </>
  );
}
