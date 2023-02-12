import Box from '@components/Box';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import { useManga } from '@database/schemas/Manga';
import { FlashList } from '@shopify/flash-list';
import React from 'react';
import MangaViewerHeader from './components/MangaViewerHeader';
import { useTheme } from '@emotion/react';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import { useRealm } from '@database/main';
import displayMessage from '@helpers/displayMessage';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';
import { NAVHEADER_HEIGHT } from '@components/NavHeader';

const MangaView: React.FC<RootStackProps<'MangaView'>> = (props) => {
  const {
    route: { params },
    navigation,
  } = props;
  const theme = useTheme();
  const { manga, status, error, refresh, update } = useManga(params, {
    preferLocal: false,
  });
  const handleOnBookmark = React.useCallback(() => {
    update((mangaObj) => {
      mangaObj.inLibrary = !mangaObj.inLibrary;
      displayMessage(
        mangaObj.inLibrary ? 'Added to library' : 'Removed from library',
      );
    });
  }, [update]);
  const scrollPosition = useSharedValue(0);
  const buttonStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      scrollPosition.value,
      [0, NAVHEADER_HEIGHT],
      [theme.palette.mangaViewerBackButtonColor, theme.palette.text.secondary],
    ),
  }));
  const { onScroll, contentContainerStyle, scrollViewStyle } =
    useCollapsibleHeader({
      headerTitle: '',
      backButtonColor: { custom: theme.palette.mangaViewerBackButtonColor },
      backButtonStyle: buttonStyle,
      headerRight: (
        <IconButton
          color={{ custom: theme.palette.mangaViewerBackButtonColor }}
          animated
          onPress={handleOnBookmark}
          icon={
            <Icon
              type="font"
              name={manga?.inLibrary ? 'bookmark' : 'bookmark-outline'}
              style={buttonStyle}
            />
          }
        />
      ),
      dependencies: [theme, manga?.inLibrary],
    });

  function handleOnScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    onScroll(e);
    scrollPosition.value = e.nativeEvent.contentOffset.y;
  }
  return (
    <FlashList
      data={manga?.chapters}
      ListHeaderComponent={
        <MangaViewerHeader
          onBookmark={handleOnBookmark}
          status={status}
          manga={params}
          meta={manga}
          error={error}
          refresh={refresh}
          scrollViewStyle={scrollViewStyle}
        />
      }
      ListFooterComponent={<Box style={contentContainerStyle} />}
      renderItem={null}
      estimatedItemSize={5}
      {...{ onScroll: handleOnScroll }}
    />
  );
};

export default MangaView;
