import Box from '@components/Box';
import Cover from '@components/Cover';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import MangaAuthors from '@screens/MangaView/components/MangaViewerHeader/components/MangaAuthors';
import MangaTitle from '@screens/MangaView/components/MangaViewerHeader/components/MangaTitle';
import React from 'react';
import { MangaViewerHeaderProps } from './MangaViewerHeader.interfaces';
import LinearGradient from 'react-native-linear-gradient';
import FastImage from 'react-native-fast-image';
import { ListRenderItem, StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import MangaRating from '@screens/MangaView/components/MangaViewerHeader/components/MangaRating';
import { useTheme } from '@emotion/react';
import Skeleton from '@components/Skeleton';
import MangaDescription from './components/MangaDescription';
import Button from '@components/Button';
import Icon from '@components/Icon';
import { FlatList } from 'react-native-gesture-handler';
import Tag from '@components/Tag';
import MangaActionButtons from '@screens/MangaView/components/MangaViewerHeader/components/MangaActionButtons';
import MangaGenres from '@screens/MangaView/components/MangaViewerHeader/components/MangaGenres';
import MangaStatus from '@screens/MangaView/components/MangaViewerHeader/components/MangaStatus';
import { useQuery, useRealm } from '@database/main';
import { ChapterSchema } from '@database/schemas/Chapter';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import MangaSupportedLanguages from '@screens/MangaView/components/MangaViewerHeader/components/MangaSupportedLanguages';
import MangaSource from '@screens/MangaView/components/MangaViewerHeader/components/MangaSource';
import IconButton from '@components/IconButton';
import Progress from '@components/Progress';

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    width: 'auto',
    height: 'auto',
  },
});

const MangaViewerHeader: React.FC<MangaViewerHeaderProps> = (props) => {
  const {
    meta,
    manga,
    scrollViewStyle,
    status,
    error,
    numberOfSelectedLanguageChapters,
    onBookmark,
    queriedChaptersForManga,
    onOpenMenu,
  } = props;
  const theme = useTheme();

  const supportedLang = React.useMemo(
    () =>
      queriedChaptersForManga.reduce(
        (prev, curr) => {
          if (curr.language != null) {
            if (!prev.a.has(curr.language))
              prev.b.push(languages[curr.language].name);
            prev.a.add(curr.language);
          }
          return prev;
        },
        { a: new Set(), b: [] as string[] },
      ).b,
    [queriedChaptersForManga, meta?.chapters],
  );

  const isLoading = status === 'loading';
  return (
    <Box>
      <FastImage
        source={{ uri: manga.imageCover }}
        style={styles.imageBackground}
      >
        <LinearGradient
          colors={['rgba(0, 0, 0, 0.25)', theme.palette.background.default]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 0.7 }}
        >
          <Box style={scrollViewStyle}>
            <Stack
              justify-content="center"
              align-items="center"
              space="s"
              px="m"
              mt="s"
              mb="m"
            >
              <Box
                flex-shrink
                align-self="center"
                box-shadow
                border-radius={moderateScale(12)}
              >
                <Cover cover={manga} scale={1.5} />
              </Box>
              <MangaTitle title={manga.title} />
              <MangaAuthors data={meta?.authors} loading={isLoading} />
              <MangaRating data={meta?.rating} loading={isLoading} />
            </Stack>
            <MangaActionButtons
              onBookmark={onBookmark}
              inLibrary={meta?.inLibrary}
            />
          </Box>
        </LinearGradient>
      </FastImage>
      <Stack
        space="s"
        background-color="paper"
        px="m"
        pt="m"
        pb="s"
        maxWidth={moderateScale(600)}
        align-self="center"
        width="100%"
      >
        <MangaDescription loading={isLoading} data={meta?.description} />
        <MangaGenres data={meta?.genres} />
        <Text variant="header" bold>
          Additional info
        </Text>
        <MangaStatus data={meta?.status} loading={isLoading} />
        <MangaSource mangaSource={manga.source} />
        <MangaSupportedLanguages
          loading={isLoading || meta == null}
          supportedLang={supportedLang}
        />

        <Stack
          space="s"
          flex-direction="row"
          justify-content="space-between"
          align-items="center"
        >
          {meta ? (
            <Text variant="header" bold>
              {numberOfSelectedLanguageChapters} Chapters
            </Text>
          ) : (
            <Stack
              flex-direction="row"
              align-self="center"
              align-items="center"
              justify-content="center"
            >
              <Skeleton>
                <Text variant="header" bold>
                  100
                </Text>
              </Skeleton>
              <Text variant="header" bold>
                {' '}
                Chapters
              </Text>
            </Stack>
          )}
          <IconButton
            icon={<Icon type="font" name="filter-menu" />}
            onPress={onOpenMenu}
          />
        </Stack>
      </Stack>
      <Box border-color="disabled" border-width={{ b: 1.5 }} />
    </Box>
  );
};

export default MangaViewerHeader;