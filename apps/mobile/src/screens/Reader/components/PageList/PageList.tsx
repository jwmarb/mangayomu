import React from 'react';
import { ReadingDirection } from '@redux/slices/settings';
import { PageListProps } from '@screens/Reader/components/PageList/PageList.interfaces';
import { FlatList, FlatListProps } from 'react-native';
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
    ...rest
  } = props;
  switch (readingDirection) {
    case ReadingDirection.WEBTOON: {
      return (
        <FlatList
          ref={ref as React.ForwardedRef<FlatList<Page>>}
          {...(rest as FlatListProps<Page>)}
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
    default:
      return (
        <FlashList
          ref={ref as React.ForwardedRef<FlashList<Page>>}
          {...rest}
          renderItem={preDeterminedRenderItem}
          extraData={extraData}
        />
      );
  }
};

export default React.forwardRef(PageList);
