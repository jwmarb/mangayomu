import connector, {
  ConnectedBasicMangaListProps,
} from './BasicMangaList.redux';
import React from 'react';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import Box, { AnimatedBox } from '@components/Box';
import useMangaFlashlistLayout from '@hooks/useMangaFlashlistLayout';
import { AnimatedFlashList } from '@components/animated';
import Icon from '@components/Icon/Icon';
import { TouchableNativeFeedback, useWindowDimensions } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useTheme } from '@emotion/react';
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
import { FlashList } from '@shopify/flash-list';
import displayMessage from '@helpers/displayMessage';

const translationInterpolation = [moderateScale(24), 0];

const BasicMangaList: React.FC<ConnectedBasicMangaListProps> = (props) => {
  const { mangas, title, bookHeight, bookWidth } = props;
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
    drawDistance,
  } = useMangaFlashlistLayout(
    {
      width: bookWidth,
      height: bookHeight,
    },
    mangas.length,
  );
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

  const theme = useTheme();
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

      <AnimatedBox
        style={style}
        box-shadow
        align-self="flex-end"
        pointerEvents="box-none"
        position="absolute"
        bottom={moderateScale(32)}
        right={moderateScale(32)}
        background-color="primary"
        border-radius={1000}
      >
        <TouchableNativeFeedback
          onPress={handleOnPress}
          onLongPress={handleOnLongPress}
          background={TouchableNativeFeedback.Ripple(
            theme.palette.primary.ripple,
            true,
          )}
        >
          <Box p="m">
            <Icon
              type="font"
              name="chevron-up"
              size={moderateScale(30)}
              color="primary@contrast"
            />
          </Box>
        </TouchableNativeFeedback>
      </AnimatedBox>
    </>
  );
};

export default connector(BasicMangaList);
