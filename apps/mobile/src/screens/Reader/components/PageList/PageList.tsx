import React from 'react';
import { ReadingDirection } from '@redux/slices/settings';
import { PageListProps } from '@screens/Reader/components/PageList/PageList.interfaces';
import { FlatListProps } from 'react-native';
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
    ...rest
  } = props;
  switch (readingDirection) {
    default: {
      return (
        <FlatList
          // scrollEnabled={false}
          simultaneousHandlers={panRef}
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
    }
    // default:
    //   return (
    //     <FlashList
    //       ref={ref as React.ForwardedRef<FlashList<Page>>}
    //       {...rest}
    //       estimatedFirstItemOffset={estimatedFirstItemOffset}
    //       initialScrollIndex={initialScrollIndex}
    //       renderItem={preDeterminedRenderItem}
    //       extraData={extraData}
    //     />
    //   );
  }
};

export default React.forwardRef(PageList);
