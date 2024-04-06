import React from 'react';
import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Image from '@/components/primitives/Image';
import ImageBackground from '@/components/primitives/ImageBackground';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useThemedProps from '@/hooks/useThemedProps';
import AltTitle from '@/screens/MangaView/components/primitives/AltTitle';
import Authors from '@/screens/MangaView/components/primitives/Authors';
import Status from '@/screens/MangaView/components/primitives/Status';
import useMangaViewData from '@/screens/MangaView/hooks/useMangaViewData';
import useMangaViewManga from '@/screens/MangaView/hooks/useMangaViewManga';
import { styles } from '@/screens/MangaView/styles';
import { createThemedProps } from '@/utils/theme';
import Icon from '@/components/primitives/Icon';
import useMangaViewSource from '@/screens/MangaView/hooks/useMangaViewSource';

const themedProps = createThemedProps((theme) => ({
  colors: ['rgba(0, 0, 0, 0.25)', theme.palette.background.paper],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0.9 },
}));

export default React.memo(function Overview() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const themedLinearGradientProps = useThemedProps(themedProps, contrast);
  const manga = useMangaViewManga();
  const source = useMangaViewSource();
  const imageSource =
    manga?.imageCover != null
      ? { uri: manga.imageCover }
      : require('@/assets/no-image-available.png');
  const data = useMangaViewData();
  return (
    <ImageBackground source={imageSource}>
      <LinearGradient
        style={style.imageBackground}
        {...themedLinearGradientProps}
      >
        <Image source={imageSource} style={style.floatingImage} />
        <View style={style.titleContainer}>
          <View style={style.sourceContainer}>
            <Icon type="image" uri={source.ICON_URI} />
            <Text variant="chip">{source.NAME}</Text>
          </View>
          <Text bold variant="h4" numberOfLines={3}>
            {manga?.title}
          </Text>
          <Authors authors={data?.authors} />
          <AltTitle title={data?.altTitles} />
          <View style={style.statusContainer}>
            <Status type="scan" status={data?.status?.scan} />
            <Status type="publish" status={data?.status?.publish} />
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
});
