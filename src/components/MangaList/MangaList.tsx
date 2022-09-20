import { AppState } from '@redux/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Orientation } from 'expo-screen-orientation';
import { FlatList, InteractionManager, useWindowDimensions } from 'react-native';
import { calculateCoverHeight, calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { FlatListProps, Animated } from 'react-native';
import { useTheme } from 'styled-components/native';
import pixelToNumber from '@utils/pixelToNumber';
import { Collapsible } from 'react-navigation-collapsible';
import { Manga } from '@services/scraper/scraper.interfaces';
import { AnimatedFlashList } from '@shopify/flash-list';

const mangaKeyExtractor = (item: Manga, index: number) => item.link + index;

function MangaList<Item extends Manga>(
  props: Omit<FlatListProps<Item>, 'keyExtractor'> & { collapsible?: Collapsible },
  ref: any
) {
  const orientation = useSelector((state: AppState) => state.settings.deviceOrientation);
  const [ready, setReady] = React.useState<boolean>(false);
  const { contentContainerStyle, collapsible, ...rest } = props;
  const { width, height } = useWindowDimensions();
  const cols = useSelector((state: AppState) => state.settings.mangaCover.perColumn);
  const numOfColumnsPortrait = React.useMemo(() => {
    switch (orientation) {
      case Orientation.PORTRAIT_DOWN:
      case Orientation.PORTRAIT_UP:
        return Math.floor(width / (calculateCoverWidth(cols) * SPACE_MULTIPLIER + 8));
      case Orientation.LANDSCAPE_LEFT:
      case Orientation.LANDSCAPE_RIGHT:
      default:
        return Math.floor(height / (calculateCoverWidth(cols) * SPACE_MULTIPLIER + 8));
    }
  }, [cols]);
  const numOfColumnsLandscape = React.useMemo(() => {
    switch (orientation) {
      case Orientation.LANDSCAPE_LEFT:
      case Orientation.LANDSCAPE_RIGHT:
      default:
        return Math.floor(width / (calculateCoverWidth(cols) * SPACE_MULTIPLIER + 8));

      case Orientation.PORTRAIT_DOWN:
      case Orientation.PORTRAIT_UP:
        return Math.floor(height / (calculateCoverWidth(cols) * SPACE_MULTIPLIER + 8));
    }
  }, [cols]);
  const theme = useTheme();
  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setReady(true);
    });
  }, []);

  if (!ready) return null;

  return (
    <AnimatedFlashList
      estimatedItemSize={calculateCoverHeight(cols) * SPACE_MULTIPLIER}
      ref={ref}
      key={orientation}
      keyExtractor={mangaKeyExtractor}
      numColumns={
        orientation === Orientation.PORTRAIT_UP || orientation === Orientation.PORTRAIT_DOWN
          ? numOfColumnsPortrait
          : numOfColumnsLandscape
      }
      contentContainerStyle={{
        paddingTop: pixelToNumber(theme.spacing(2)) + (collapsible ? collapsible.containerPaddingTop : 0),
        paddingBottom: pixelToNumber(theme.spacing(24)),
      }}
      {...(collapsible
        ? {
            scrollIndicatorInsets: { top: collapsible.scrollIndicatorInsetTop },
            onScroll: collapsible.onScroll,
          }
        : {})}
      {...(rest as any)}
    />
  );
}

const forwardedMangaList = React.forwardRef<any, any>(MangaList as any);

export default forwardedMangaList;
