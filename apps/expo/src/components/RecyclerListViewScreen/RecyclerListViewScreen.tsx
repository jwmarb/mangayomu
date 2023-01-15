import { ScrollViewWithCollapsible } from '@components/RecyclerListViewScreen/RecyclerListViewScreen.base';
import { RecyclerListViewScreenProps } from '@components/RecyclerListViewScreen/RecyclerListViewScreen.interfaces';
import React from 'react';
import { RecyclerListView, RecyclerListViewProps } from 'recyclerlistview';
import PropTypes from 'prop-types';
(RecyclerListView.propTypes as { externalScrollView: {} }).externalScrollView = PropTypes.object;

const RecyclerListViewScreen: React.ForwardRefRenderFunction<
  RecyclerListView<RecyclerListViewProps, any>,
  RecyclerListViewScreenProps
> = (props, ref) => {
  const { scrollViewProps = {}, listener, collapsible, ...rest } = props;

  return (
    <RecyclerListView
      ref={ref}
      externalScrollView={ScrollViewWithCollapsible as any}
      scrollViewProps={{ ...scrollViewProps, listener, collapsible }}
      {...rest}
    />
  );
};

export default React.forwardRef(RecyclerListViewScreen);
