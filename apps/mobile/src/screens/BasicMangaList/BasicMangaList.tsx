import React from 'react';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import Box from '@components/Box';
import useMangaFlashlistLayout from '@hooks/useMangaFlashlistLayout';
import { AnimatedFlashList } from '@components/animated';
import { useWindowDimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import {
  Easing,
  interpolate,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import displayMessage from '@helpers/displayMessage';
import ScrollToTop from '@screens/BasicMangaList/components/ScrollToTop';
import useAppSelector from '@hooks/useAppSelector';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import type { FlashList } from '@shopify/flash-list';

const translationInterpolation = [moderateScale(24), 0];

const BasicMangaList: React.FC<RootStackProps<'BasicMangaList'>> = (props) => {
  const {
    route: {
      params: { stateKey },
    },
  } = props;
  const mangas = useAppSelector((state) => state.explore.states[stateKey]);
  const title =
    props.route.params.stateKey === 'latest'
      ? 'Recently updated'
      : 'Trending updates';
  const { height } = useWindowDimensions();
  const { onScroll, contentContainerStyle, scrollViewStyle, scrollOffset } =
    useCollapsibleHeader({ headerTitle: title });
  const {
    estimatedItemSize,
    columns,
    renderItem,
    keyExtractor,
    key,
    overrideItemLayout,
    estimatedListSize,
    drawDistance,
  } = useMangaFlashlistLayout(mangas.length);
  const flashList = useAnimatedRef<FlashList<any>>();
  const opacity = useSharedValue<number>(0);
  const translateY = useDerivedValue(() =>
    interpolate(opacity.value, [0, 1], translationInterpolation),
  );

  useAnimatedReaction(
    () => scrollOffset.value,
    (result) => {
      if (result >= height / 2)
        opacity.value = withTiming(1, { duration: 150, easing: Easing.ease });
      else
        opacity.value = withTiming(0, { duration: 150, easing: Easing.ease });
    },
  );

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  function handleOnPress() {
    flashList.current?.scrollToOffset({ offset: 0, animated: true });
  }
  function handleOnLongPress() {
    displayMessage('Scroll to top');
  }

  return (
    <>
      <AnimatedFlashList
        ref={flashList}
        estimatedListSize={estimatedListSize}
        drawDistance={drawDistance}
        estimatedItemSize={estimatedItemSize}
        overrideItemLayout={overrideItemLayout}
        data={mangas}
        key={key}
        numColumns={columns}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListFooterComponent={<Box style={contentContainerStyle} />}
        onScroll={onScroll}
        onMomentumScrollEnd={onScroll}
        ListHeaderComponent={<Box style={scrollViewStyle} />}
      />
      <ScrollToTop
        onPress={handleOnPress}
        onLongPress={handleOnLongPress}
        style={style}
      />
    </>
  );
};

export default BasicMangaList;
