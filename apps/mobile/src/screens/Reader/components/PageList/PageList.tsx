import React from 'react';
import { ReadingDirection } from '@redux/slices/settings';
import { PageListProps } from './';
import { FlatListProps, ScrollView, ScrollViewProps } from 'react-native';
import { FlatList, GestureDetector } from 'react-native-gesture-handler';
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
    extraData,
    initialScrollIndex,
    estimatedFirstItemOffset,
    nativeFlatListGesture,
    ...rest
  } = props;

  // return (
  //   <FlatList
  //     // scrollEnabled={false}
  //     simultaneousHandlers={panRef}
  //     onActivated={
  //       readingDirection !== ReadingDirection.WEBTOON
  //         ? handleOnActivated
  //         : undefined
  //     }
  //     ref={ref as React.ForwardedRef<FlatList<Page>>}
  //     {...(rest as FlatListProps<Page>)}
  //     initialScrollIndex={
  //       initialScrollIndex != null
  //         ? estimatedFirstItemOffset !== 0
  //           ? initialScrollIndex + 1
  //           : initialScrollIndex
  //         : undefined
  //     }
  //     extraData={extraData}
  //     renderItem={
  //       preDeterminedRenderItem != null
  //         ? (info) => {
  //             (info as unknown as FlashListRenderItemInfo<Page>).extraData =
  //               extraData;
  //             return preDeterminedRenderItem(
  //               info as unknown as FlashListRenderItemInfo<Page>,
  //             );
  //           }
  //         : null
  //     }
  //   />
  // );
  const renderScrollComponent = React.useMemo(
    () =>
      React.forwardRef<ScrollView>((props, ref) => (
        <GestureDetector gesture={nativeFlatListGesture}>
          <ScrollView ref={ref} {...props} overScrollMode="never" />
        </GestureDetector>
      )),
    [nativeFlatListGesture],
  ) as unknown as React.FC<ScrollViewProps>;

  // switch (readingDirection) {
  //   default:
  //     return (
  //       <FlatList
  //         // scrollEnabled={false}
  //         simultaneousHandlers={panRef}
  //         onActivated={handleOnActivated}
  //         ref={ref as React.ForwardedRef<FlatList<Page>>}
  //         {...(rest as FlatListProps<Page>)}
  //         initialScrollIndex={
  //           initialScrollIndex != null
  //             ? estimatedFirstItemOffset !== 0
  //               ? initialScrollIndex + 1
  //               : initialScrollIndex
  //             : undefined
  //         }
  //         extraData={extraData}
  //         renderItem={
  //           preDeterminedRenderItem != null
  //             ? (info) => {
  //                 (info as unknown as FlashListRenderItemInfo<Page>).extraData =
  //                   extraData;
  //                 return preDeterminedRenderItem(
  //                   info as unknown as FlashListRenderItemInfo<Page>,
  //                 );
  //               }
  //             : null
  //         }
  //       />
  //     );
  // case ReadingDirection.WEBTOON:
  return (
    <FlashList
      renderScrollComponent={renderScrollComponent}
      ref={ref as React.ForwardedRef<FlashList<Page>>}
      {...rest}
      estimatedFirstItemOffset={estimatedFirstItemOffset}
      initialScrollIndex={initialScrollIndex}
      renderItem={preDeterminedRenderItem}
      extraData={extraData}
    />
  );
  // }
};

export default React.forwardRef(PageList);
