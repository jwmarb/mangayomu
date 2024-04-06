import React from 'react';
import { useQuery } from '@tanstack/react-query';
import LinearGradient from 'react-native-linear-gradient';
import { View } from 'react-native';
import Icon from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import useManga from '@/hooks/useManga';
import useMangaSource from '@/hooks/useMangaSource';
import { RootStackProps } from '@/screens/navigator';
import { styles } from '@/screens/MangaView/styles';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import Text from '@/components/primitives/Text';
import ImageBackground from '@/components/primitives/ImageBackground';
import { createThemedProps } from '@/utils/theme';
import useThemedProps from '@/hooks/useThemedProps';
import Image from '@/components/primitives/Image';
import Action from '@/screens/MangaView/components/Action';
import AltTitle from '@/screens/MangaView/components/AltTitle';
import Status from '@/screens/MangaView/components/Status';
import Synopsis from '@/screens/MangaView/components/Synopsis';
import {
  MangaViewFetchStatusContext,
  MangaViewMangaSourceContext,
} from '@/screens/MangaView/context';

const themedProps = createThemedProps((theme) => ({
  colors: ['rgba(0, 0, 0, 0.25)', theme.palette.background.paper],
  start: { x: 0, y: 0 },
  end: { x: 0, y: 0.9 },
}));

export default function MangaView(props: RootStackProps<'MangaView'>) {
  const {
    navigation,
    route: {
      params: { manga: unparsedManga, source: sourceStr },
    },
  } = props;
  const source = useMangaSource({ manga: unparsedManga, source: sourceStr });
  const manga = useManga(unparsedManga, source);
  const { data, status } = useQuery({
    queryKey: [manga.link],
    queryFn: ({ signal }) => source.meta(manga, signal),
    select: (data) => source.toMangaMeta(data),
  });
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const collapsible = useCollapsibleHeader({
    showHeaderCenter: false,
    headerRightStyle: style.headerRight,
    headerRight: (
      <>
        <IconButton icon={<Icon type="icon" name="bookmark-outline" />} />
        <IconButton icon={<Icon type="icon" name="web" />} />
      </>
    ),
  });
  const themedLinearGradientProps = useThemedProps(themedProps, contrast);

  const imageSource =
    manga.imageCover != null
      ? { uri: manga.imageCover }
      : require('@/assets/no-image-available.png');

  return (
    <MangaViewFetchStatusContext.Provider value={status}>
      <MangaViewMangaSourceContext.Provider value={source}>
        <Screen.FlatList
          ignoreHeaderOffset
          ListHeaderComponent={
            <>
              <ImageBackground source={imageSource}>
                <LinearGradient
                  style={style.imageBackground}
                  {...themedLinearGradientProps}
                >
                  <Image source={imageSource} style={style.floatingImage} />
                  <View style={style.titleContainer}>
                    <Text bold variant="h4" numberOfLines={3}>
                      {manga.title}
                    </Text>
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
                  <Action
                    title="Read"
                    icon={<Icon type="icon" name="book-play-outline" />}
                  />
                  <Action
                    title="Save"
                    icon={<Icon type="icon" name="bookmark-outline" />}
                  />
                  <Action
                    title="WebView"
                    icon={<Icon type="icon" name="web" />}
                  />
                </View>
                <Synopsis description={data?.description} />
              </View>
            </>
          }
          collapsible={collapsible}
          data={[]}
          renderItem={() => null}
        />
      </MangaViewMangaSourceContext.Provider>
    </MangaViewFetchStatusContext.Provider>
  );
}
