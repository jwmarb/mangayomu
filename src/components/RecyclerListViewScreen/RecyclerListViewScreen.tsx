import { ScrollViewWithCollapsible } from '@components/RecyclerListViewScreen/RecyclerListViewScreen.base';
import { RecyclerListViewScreenProps } from '@components/RecyclerListViewScreen/RecyclerListViewScreen.interfaces';
import React from 'react';
import { RecyclerListView } from 'recyclerlistview';

const RecyclerListViewScreen: React.FC<RecyclerListViewScreenProps> = (props) => {
  const { scrollViewProps = {}, listener, collapsible, ...rest } = props;
  return (
    <RecyclerListView
      externalScrollView={ScrollViewWithCollapsible as any}
      scrollViewProps={{ ...scrollViewProps, listener, collapsible }}
      {...rest}
    />
  );
};

export default RecyclerListViewScreen;
