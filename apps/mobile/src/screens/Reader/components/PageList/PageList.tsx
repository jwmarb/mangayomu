import React from 'react';
import { ReadingDirection } from '@redux/slices/settings';
import { PageListProps } from './';
import { FlatListProps, ScrollViewProps } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import {
  FlashList,
  ListRenderItemInfo as FlashListRenderItemInfo,
} from '@shopify/flash-list';
import { Page } from '@redux/slices/reader';

const PageList: React.ForwardRefRenderFunction<
  FlashList<Page> | FlatList<Page>,
  PageListProps
> = (props: PageListProps, ref) => {
  const {
    renderItem: preDeterminedRenderItem,
    readingDirection,
    extraData,
    initialScrollIndex,
    estimatedFirstItemOffset,
    panRef,
    pinchRef,
    pageGestures,
    currentPageKey,
    ...rest
  } = props;
  const handleOnActivated = () => {
    pageGestures.current[currentPageKey.current].onFlashlistActive();
  };
  return (
    <FlatList
      // scrollEnabled={false}
      simultaneousHandlers={panRef}
      onActivated={
        readingDirection !== ReadingDirection.WEBTOON
          ? handleOnActivated
          : undefined
      }
      ref={ref as React.ForwardedRef<FlatList<Page>>}
      {...(rest as FlatListProps<Page>)}
      initialScrollIndex={
        initialScrollIndex != null
          ? estimatedFirstItemOffset !== 0
            ? initialScrollIndex + 1
            : initialScrollIndex
          : undefined
      }
      extraData={extraData}
      renderItem={
        preDeterminedRenderItem != null
          ? (info) => {
              (info as unknown as FlashListRenderItemInfo<Page>).extraData =
                extraData;
              return preDeterminedRenderItem(
                info as unknown as FlashListRenderItemInfo<Page>,
              );
            }
          : null
      }
    />
  );
  // const renderScrollComponent = React.useMemo(
  //   () =>
  //     React.forwardRef<ScrollView>((props, ref) => (
  //       <ScrollView
  //         ref={ref}
  //         {...props}
  //         simultaneousHandlers={panRef}
  //         onActivated={handleOnActivated}
  //       />
  //     )),
  //   [],
  // ) as unknown as React.FC<ScrollViewProps>;
  // switch (readingDirection) {
  //   default: {
  //     ;
  //   }
  //   // default:
  //   //   return (
  //   //     <FlashList
  //   //       renderScrollComponent={renderScrollComponent}
  //   //       ref={ref as React.ForwardedRef<FlashList<Page>>}
  //   //       {...rest}
  //   //       estimatedFirstItemOffset={estimatedFirstItemOffset}
  //   //       initialScrollIndex={initialScrollIndex}
  //   //       renderItem={preDeterminedRenderItem}
  //   //       extraData={extraData}
  //   //     />
  //   //   );
  // }
};

export default React.forwardRef(PageList);
