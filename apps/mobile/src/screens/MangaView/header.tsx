import { View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from '@/components/primitives/Icon';
import Image from '@/components/primitives/Image';
import ImageBackground from '@/components/primitives/ImageBackground';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useThemedProps from '@/hooks/useThemedProps';
import Action from '@/screens/MangaView/components/primitives/Action';
import AltTitle from '@/screens/MangaView/components/primitives/AltTitle';
import Authors from '@/screens/MangaView/components/primitives/Authors';
import Status from '@/screens/MangaView/components/primitives/Status';
import Synopsis from '@/screens/MangaView/components/primitives/Synopsis';
import useMangaViewData from '@/screens/MangaView/hooks/useMangaViewData';
import { styles } from '@/screens/MangaView/styles';
import { createThemedProps } from '@/utils/theme';
import useMangaViewManga from '@/screens/MangaView/hooks/useMangaViewManga';
import Genres from '@/screens/MangaView/components/primitives/Genres';

const themedProps = createThemedProps((theme) => ({
  colors: ['rgba(0, 0, 0, 0.25)', theme.palette.background.paper],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0.9 },
}));

const READ_ICON = <Icon type="icon" name="book-play-outline" />;
const SAVE_ICON = <Icon type="icon" name="bookmark-outline" />;
const WEBVIEW_ICON = <Icon type="icon" name="web" />;

export default function ListHeaderComponent() {
  const contrast = useContrast();
  const data = useMangaViewData();
  const manga = useMangaViewManga();
  const themedLinearGradientProps = useThemedProps(themedProps, contrast);
  const style = useStyles(styles, contrast);

  const imageSource =
    manga?.imageCover != null
      ? { uri: manga.imageCover }
      : require('@/assets/no-image-available.png');
  return (
    <>
      <ImageBackground source={imageSource}>
        <LinearGradient
          style={style.imageBackground}
          {...themedLinearGradientProps}
        >
          <Image source={imageSource} style={style.floatingImage} />
          <View style={style.titleContainer}>
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
      <View style={style.metaContainer}>
        <View style={style.actionContainer}>
          <Action title="Read" icon={READ_ICON} />
          <Action title="Save" icon={SAVE_ICON} />
          <Action title="WebView" icon={WEBVIEW_ICON} />
        </View>
        <Synopsis description={data?.description} />
        <Genres genres={data?.genres} />
      </View>
    </>
  );
}
