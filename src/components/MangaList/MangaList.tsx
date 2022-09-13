import { AppState } from '@redux/store';
import React from 'react';
import { useSelector } from 'react-redux';
import { Orientation } from 'expo-screen-orientation';
import { FlatList, useWindowDimensions } from 'react-native';
import { calculateCoverWidth } from '@components/Manga/Cover/Cover.helpers';
import { SPACE_MULTIPLIER } from '@theme/Spacing';
import { FlatListProps, Animated } from 'react-native';
import { useTheme } from 'styled-components/native';
import pixelToNumber from '@utils/pixelToNumber';
import { Collapsible } from 'react-navigation-collapsible';
function MangaList<Item>(props: FlatListProps<Item> & { collapsible?: Collapsible }, ref: any) {
  const orientation = useSelector((state: AppState) => state.settings.deviceOrientation);
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

  return (
    <Animated.FlatList
      ref={ref}
      key={orientation}
      numColumns={
        orientation === Orientation.PORTRAIT_UP || orientation === Orientation.PORTRAIT_DOWN
          ? numOfColumnsPortrait
          : numOfColumnsLandscape
      }
      contentContainerStyle={{
        paddingTop: pixelToNumber(theme.spacing(2)) + (collapsible ? collapsible.containerPaddingTop : 0),
        paddingBottom: pixelToNumber(theme.spacing(24)),
        alignItems: 'center',
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

export default React.forwardRef<any, any>(MangaList as any);
