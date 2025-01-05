import React from 'react';
import Text from '@/components/primitives/Text';
import { HistoryEntry } from '@/models/HistoryEntry';
import useStyles from '@/hooks/useStyles';
import { styles } from './styles';
import useContrast from '@/hooks/useContrast';
import { View } from 'react-native';
import Image from '@/components/primitives/Image';
import { LocalManga } from '@/models/LocalManga';
import { useQuery } from '@tanstack/react-query';
import Pressable from '@/components/primitives/Pressable';
import { useNavigation } from '@react-navigation/native';

type EntryProps = {
  entry: HistoryEntry;
};

function Entry(props: EntryProps) {
  const { entry } = props;
  const contrast = useContrast();
  const navigation = useNavigation();
  const style = useStyles(styles, contrast);
  const { data, isFetched } = useQuery({
    queryFn: () => Promise.all([entry.localChapter, entry.localManga]),
    queryKey: ['history', entry.localMangaLink],
  });

  const localChapter = data?.[0];
  const localManga = data?.[1];
  const handleOnPress = () => {
    if (localManga != null) {
      navigation.navigate('MangaView', { manga: localManga.toManga() });
    }
  };
  if (isFetched) {
    const source = localManga?.imageCover
      ? { uri: localManga?.imageCover }
      : require('@/assets/no-image-available.png');
    return (
      <Pressable onPress={handleOnPress}>
        <View style={style.container}>
          <Image style={style.imageCover} source={source} />
          <View style={style.information}>
            <Text variant="body2" numberOfLines={2}>
              {localManga?.title}
            </Text>
            <Text variant="chip" numberOfLines={1} color="textSecondary">
              {localChapter?.name}
            </Text>
            <Text variant="chip" numberOfLines={1} color="textSecondary" italic>
              {localChapter?.subname}
            </Text>
            <Text variant="body2" color="textSecondary">
              {entry.updatedAt.toString()}
            </Text>
          </View>
        </View>
      </Pressable>
    );
  }

  return null;
}

export default React.memo(Entry);
