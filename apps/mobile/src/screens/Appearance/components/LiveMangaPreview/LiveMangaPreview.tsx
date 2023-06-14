import React from 'react';
import { LiveMangaPreviewProps } from './LiveMangaPreview.interfaces';
import useBoolean from '@hooks/useBoolean';
import { useTheme } from '@emotion/react';
import Button from '@components/Button';
import Divider from '@components/Divider';
import Box, { AnimatedBox } from '@components/Box';
import IconButton from '@components/IconButton';
import { moderateScale } from 'react-native-size-matters';
import Text from '@components/Text';
import Input from '@components/Input';
import Stack from '@components/Stack';
import Icon from '@components/Icon';
import { Freeze } from 'react-freeze';
import {
  BackHandler,
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
import { useRealm } from '@database/main';
import { MangaSchema } from '@database/schemas/Manga';
import NetInfo from '@react-native-community/netinfo';
import useDialog from '@hooks/useDialog';
import { MangaHost } from '@mangayomu/mangascraper';
import { getErrorMessage } from '@helpers/getErrorMessage';
import Progress from '@components/Progress/Progress';
import { Portal } from '@gorhom/portal';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const LiveMangaPreview: React.FC<LiveMangaPreviewProps> = (props) => {
  const {
    children,
    imageURL,
    setImageURL,
    bookTitle,
    setBookTitle,
    setSource,
    onLibraryPreview,
  } = props;
  const [livePreview, toggleLivePreview] = useBoolean();
  const [loading, toggleLoading] = useBoolean();
  const [expand, toggleExpand] = useBoolean();
  const opacity = useSharedValue(0);
  const insets = useSafeAreaInsets();
  const dialog = useDialog();
  const theme = useTheme();
  const realm = useRealm();
  const expandedImageStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));
  function handleOnSubmitImageURL(
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) {
    setImageURL(e.nativeEvent.text);
  }
  function handleOnBookTitleClear(str: string) {
    if (str.length === 0) setBookTitle('');
  }
  function handleOnImageURLClear(str: string) {
    if (str.length === 0) setImageURL('');
  }
  function handleOnSubmitBookTitle(
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) {
    setBookTitle(e.nativeEvent.text);
  }
  async function onGenerateRandomManga() {
    toggleLoading(true);
    try {
      const mangas = realm.objects(MangaSchema);
      if (mangas.length > 10) {
        // resolve to online fetching
        const netInfo = await NetInfo.fetch();
        if (netInfo.isInternetReachable) {
          const sources = MangaHost.getListSources();
          const source = MangaHost.getAvailableSources().get(
            sources[Math.floor(Math.random() * sources.length)],
          );
          if (source != null) {
            const mangasOnline = await source.search('');
            const randomManga =
              mangasOnline[Math.floor(mangasOnline.length * Math.random())];
            setBookTitle(randomManga.title);
            setImageURL(randomManga.imageCover);
            setSource(randomManga.source);
          } else
            dialog.open({
              title: 'Failed to generate random manga',
              message: `${source} does not exist`,
            });
        } else
          dialog.open({
            title: 'Failed to generate random manga',
            message:
              'There is no available internet connection to get a random manga. Please try again when internet is available',
          });
      } else {
        const randomManga = mangas[Math.floor(Math.random() * mangas.length)];
        setBookTitle(randomManga.title);
        setImageURL(randomManga.imageCover);
        setSource(randomManga.source);
      }
    } catch (e) {
      dialog.open({
        title: 'Failed to generate random manga',
        message: getErrorMessage(e),
      });
    } finally {
      toggleLoading(false);
    }
  }
  React.useEffect(() => {
    const handler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (!expand) return false;
      handleOnShrink();
      return true;
    });
    return () => {
      handler.remove();
    };
  }, [expand]);
  function handleOnExpand() {
    toggleExpand(true);
    opacity.value = withTiming(1, { duration: 150, easing: Easing.ease });
  }
  function handleOnShrink() {
    toggleExpand(false);
    opacity.value = withTiming(0, { duration: 150, easing: Easing.ease });
  }
  return (
    <Box
      border-color="@theme"
      border-width="@theme"
      border-radius="@theme"
      mx="m"
      mt="m"
      background-color="paper"
      overflow="hidden"
    >
      <Portal>
        <AnimatedBox
          pointerEvents={!expand ? 'none' : 'box-none'}
          align-items="center"
          background-color="rgba(0, 0, 0, 0.7)"
          justify-content="center"
          style={expandedImageStyle}
          border-color="@theme"
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
        >
          <TouchableWithoutFeedback
            onPress={handleOnShrink}
            style={{
              width: '100%',
              height: '100%',
              flexDirection: 'row',
            }}
          >
            <Box
              position="absolute"
              top={insets.top}
              p="xl"
              left={0}
              right={0}
              bottom={0}
            >
              <Text variant="header" align="center">
                Tap anywhere to close
              </Text>
            </Box>
            <Box
              left={0}
              right={0}
              top={0}
              bottom={0}
              flex-grow
              justify-content="center"
              align-items="center"
            >
              <Box align-self="center">{children}</Box>
            </Box>
          </TouchableWithoutFeedback>
        </AnimatedBox>
      </Portal>
      <Button
        sharp
        label={livePreview ? 'Hide Preview' : 'Live Preview Manga'}
        onPress={() => {
          toggleLivePreview();
        }}
      />
      <Freeze freeze={!livePreview}>
        <Divider />
        <Box justify-content="center">
          <Box
            position="absolute"
            right={moderateScale(4)}
            top={moderateScale(4)}
          >
            <IconButton
              icon={<Icon type="font" name="arrow-expand" />}
              onPress={handleOnExpand}
            />
          </Box>
          <Box
            align-self="center"
            p="m"
            height={moderateScale(400)}
            overflow="hidden"
          >
            {children}
          </Box>
          <Divider />
          <Stack space="s" py="m" px="l">
            <Text>Title</Text>
            <Input
              width="100%"
              defaultValue={bookTitle}
              onSubmitEditing={handleOnSubmitBookTitle}
              onChangeText={handleOnBookTitleClear}
              placeholder="Enter a title..."
            />
            <Text>Image URL</Text>
            <Input
              width="100%"
              placeholder="Enter an Image URL..."
              defaultValue={imageURL}
              onSubmitEditing={handleOnSubmitImageURL}
              onChangeText={handleOnImageURLClear}
            />
          </Stack>
        </Box>
        <Divider />
        <Box>
          <Button
            onPress={onGenerateRandomManga}
            disabled={loading}
            label="Generate Random Manga"
            variant="contained"
            icon={
              loading ? (
                <Progress size="small" />
              ) : (
                <Icon type="font" name="refresh" />
              )
            }
            enabled={!loading}
            sharp
          />
        </Box>
        <Divider />
        <Button
          color="secondary"
          variant="contained"
          sharp
          icon={<Icon type="font" name="eye" />}
          label="Library Preview"
          onPress={onLibraryPreview}
        />
      </Freeze>
    </Box>
  );
};

export default LiveMangaPreview;
