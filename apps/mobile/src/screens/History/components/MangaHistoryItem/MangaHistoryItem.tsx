import { bookDimensions, BOOK_COVER_RATIO } from '@components/Book';
import Box, { AnimatedBox } from '@components/Box';
import Cover from '@components/Cover';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Progress from '@components/Progress';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { useLocalObject, useObject } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import { MangaSchema } from '@database/schemas/Manga';
import { useTheme } from '@emotion/react';
import displayMessage from '@helpers/displayMessage';
import useDialog from '@hooks/useDialog';
import useRootNavigation from '@hooks/useRootNavigation';
import { AUTO_HEIGHT_SCALAR } from '@redux/slices/settings';
import connector, {
  ConnectedMangaHistoryItemProps,
} from '@screens/History/components/MangaHistoryItem/MangaHistoryItem.redux';
import { format } from 'date-fns';
import React from 'react';
import { Alert, Image, useWindowDimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import {
  RectButton,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  cover: {
    width: '64@ms',
    height: `${Math.round(
      (64 / (bookDimensions.width / bookDimensions.height)) *
        AUTO_HEIGHT_SCALAR,
    )}@ms`,
    borderRadius: '8@ms',
  },
});

export const MANGA_HISTORY_ITEM_HEIGHT = moderateScale(100);

const MangaHistoryItem: React.FC<ConnectedMangaHistoryItemProps> = (props) => {
  const { item, deleteMangaFromHistory, sectionDate } = props;
  const { width } = useWindowDimensions();
  const navigation = useRootNavigation();
  const manga = useObject(MangaSchema, item.manga);
  const chapter = useLocalObject(ChapterSchema, item.chapter);
  const dialog = useDialog();
  const errorOpacity = useSharedValue(0);
  const loaderOpacity = useSharedValue(0);
  const theme = useTheme();

  function handleOnDeleteFromHistory() {
    dialog.open({
      title: 'Remove from history?',
      message: "This will delete this manga's entry. Are you sure?",
      actions: [
        { text: 'Cancel' },
        {
          text: 'Remove',
          type: 'destructive',
          onPress: () => {
            deleteMangaFromHistory({ sectionDate, item });
          },
        },
      ],
    });
  }
  function handleOnLongPress() {
    if (manga != null) displayMessage(manga.title);
  }
  function handleOnPress() {
    if (manga != null && chapter != null)
      navigation.navigate('Reader', {
        chapter: item.chapter,
        manga: item.manga,
      });
    else if (manga != null) navigation.navigate('MangaView', manga);
  }
  function handleOnPressCover() {
    if (manga != null) navigation.navigate('MangaView', manga);
  }
  function handleOnError() {
    errorOpacity.value = 1;
  }
  function handleOnLoadEnd() {
    loaderOpacity.value = 0;
  }
  function handleOnLoadStart() {
    loaderOpacity.value = 1;
  }
  const errorContainer = useAnimatedStyle(
    () => ({
      opacity: errorOpacity.value,
      position: 'absolute',
      zIndex: 1000,
    }),
    [],
  );
  const loaderContainer = useAnimatedStyle(() => ({
    opacity: loaderOpacity.value,
  }));
  const styledError = React.useMemo(
    () => [errorContainer, styles.cover],
    [errorContainer, styles.cover],
  );
  return (
    <RectButton
      rippleColor={theme.palette.action.ripple}
      onLongPress={handleOnLongPress}
      onPress={handleOnPress}
    >
      <Box
        px="m"
        py="s"
        height={MANGA_HISTORY_ITEM_HEIGHT}
        justify-content="center"
      >
        {manga == null && <Text color="error">{item.manga} is undefined</Text>}
        {chapter == null && (
          <Text color="error">{item.chapter} is undefined</Text>
        )}
        {manga != null && chapter != null && (
          <Stack space="s" flex-direction="row" justify-content="space-between">
            <Stack
              space="s"
              flex-direction="row"
              align-items="center"
              flex-shrink
            >
              <TouchableWithoutFeedback
                disallowInterruption
                onPress={handleOnPressCover}
              >
                <FastImage
                  onLoadStart={handleOnLoadStart}
                  onLoadEnd={handleOnLoadEnd}
                  onError={handleOnError}
                  source={{ uri: manga.imageCover }}
                  style={styles.cover}
                  resizeMode={FastImage.resizeMode.cover}
                />
                <AnimatedBox
                  style={loaderContainer}
                  position="absolute"
                  justify-content="center"
                  bottom={0}
                  left={0}
                  right={0}
                  top={0}
                  z-index={-1000}
                >
                  <Progress size="small" />
                </AnimatedBox>
                <Animated.Image
                  source={require('@assets/No-Image-Placeholder.png')}
                  style={styledError}
                />
              </TouchableWithoutFeedback>
              <Box align-self="center" flex-shrink>
                <Text bold variant="book-title" numberOfLines={2}>
                  {manga.title}
                </Text>
                <Stack space="s" flex-direction="row" align-items="center">
                  <Text
                    color="textSecondary"
                    variant="book-title"
                    numberOfLines={1}
                  >
                    {chapter.name}
                  </Text>
                  <Text color="textSecondary">•</Text>
                  <Text color="textSecondary" bold>
                    {format(item.date, 'h:mm a')}
                  </Text>
                </Stack>
              </Box>
            </Stack>
            <IconButton
              icon={<Icon type="font" name="trash-can-outline" />}
              onPress={handleOnDeleteFromHistory}
            />
          </Stack>
        )}
      </Box>
    </RectButton>
  );
};

export default connector(React.memo(MangaHistoryItem));
