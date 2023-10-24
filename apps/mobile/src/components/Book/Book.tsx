import Badge, { BadgeLocation } from '@components/Badge';
import { BookProps } from './';
import Box from '@components/Box/Box';
import Cover from '@components/Cover';
import { coverStyles } from '@components/Cover/Cover';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { MangaSchema } from '@database/schemas/Manga';
import { useTheme } from '@emotion/react';
import displayMessage from '@helpers/displayMessage';
import vibrate from '@helpers/vibrate';
import useMangaSource from '@hooks/useMangaSource';
import useRootNavigation from '@hooks/useRootNavigation';
import { BookStyle } from '@redux/slices/settings';
import React from 'react';
import { Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import useAppSelector from '@hooks/useAppSelector';

const styles = ScaledSheet.create({
  linearGradient: {
    flexGrow: 1,
    flexDirection: 'column-reverse',
  },
});

const Book: React.FC<BookProps> = (props) => {
  const { manga } = props;
  const width = useAppSelector((state) => state.settings.book.width);
  const height = useAppSelector((state) => state.settings.book.height);
  const fontSize = useAppSelector((state) => state.settings.book.title.size);
  const letterSpacing = useAppSelector(
    (state) => state.settings.book.title.letterSpacing,
  );
  const bold = useAppSelector((state) => state.settings.book.title.bold);
  const align = useAppSelector((state) => state.settings.book.title.alignment);
  const bookStyle = useAppSelector((state) => state.settings.book.style);
  const paddingHorizontal = useAppSelector(
    (state) => state.settings.book.paddingHorizontal,
  );

  const navigation = useRootNavigation();
  const dbManga =
    '_id' in manga
      ? (manga as unknown as MangaSchema & Realm.Object<MangaSchema, never>)
      : null;
  const source = useMangaSource(manga);

  function handleOnPress() {
    navigation.navigate('MangaView', manga);
  }
  function handleOnLongPress() {
    displayMessage(manga.title);
    vibrate();
  }
  const theme = useTheme();

  const textStyle = React.useMemo(
    () => ({ fontSize, letterSpacing }),
    [fontSize, letterSpacing],
  );

  const linearGradientStyle = React.useMemo(
    () => [
      {
        paddingHorizontal,
        paddingBottom: theme.style.spacing.s,
      },
      styles.linearGradient,
    ],
    [styles.linearGradient, theme.style.spacing.s],
  );

  if (bookStyle === BookStyle.TACHIYOMI)
    return (
      <Box align-self="center" overflow="hidden" style={coverStyles.button}>
        <Pressable
          android_ripple={{
            color: theme.palette.action.ripple,
            foreground: true,
          }}
          onPress={handleOnPress}
          onLongPress={handleOnLongPress}
        >
          <Stack space="s" width={width} minHeight={height}>
            <Badge
              type="number"
              count={dbManga?.notifyNewChaptersCount ?? 0}
              placement={BadgeLocation.TOP_LEFT}
              color="primary"
            >
              <Badge type="image" uri={source.icon} show>
                <Cover cover={manga} manga={manga}>
                  <LinearGradient
                    colors={['transparent', 'rgba(0, 0, 0, 0.5)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 0, y: 1 }}
                    style={linearGradientStyle}
                  >
                    <Text
                      style={textStyle}
                      numberOfLines={2}
                      bold={bold}
                      align={align}
                      color={theme.helpers.getContrastText('#000000')}
                    >
                      {manga.title}
                    </Text>
                  </LinearGradient>
                </Cover>
              </Badge>
            </Badge>
          </Stack>
        </Pressable>
      </Box>
    );

  return (
    <Box style={coverStyles.button} overflow="hidden" align-self="center">
      <Pressable
        android_ripple={{
          color: theme.palette.action.ripple,
        }}
        onPress={handleOnPress}
        onLongPress={handleOnLongPress}
      >
        <Stack space="s" width={width} minHeight={height}>
          <Badge
            type="number"
            count={dbManga?.notifyNewChaptersCount ?? 0}
            placement={BadgeLocation.TOP_LEFT}
            color="primary"
          >
            <Badge type="image" uri={source.icon} show>
              <Cover cover={manga} manga={manga} />
            </Badge>
          </Badge>
          <Text style={textStyle} numberOfLines={2} bold={bold} align={align}>
            {manga.title}
          </Text>
        </Stack>
      </Pressable>
    </Box>
  );
};

export default React.memo(Book);
