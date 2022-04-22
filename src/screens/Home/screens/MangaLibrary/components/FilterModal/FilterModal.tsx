import { Icon, List, ListItem, Modal, Tab, Tabs } from '@components/core';
import { FilterModalProps } from '@screens/Home/screens/MangaLibrary/components/FilterModal/FilterModal.interfaces';
import SortTypeItem from '@screens/Home/screens/MangaLibrary/components/SortTypeItem';
import { useSort } from '@screens/Home/screens/MangaLibrary/MangaLibrary.context';
import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

const FilterModal: React.FC<FilterModalProps> = (props) => {
  const { onClose, expand, tabIndex, setTabIndex, sortTypes, children, sort, ...rest } = props;
  return (
    <Modal onClose={onClose} visible={expand}>
      <Tabs onTabChange={setTabIndex} tabIndex={tabIndex}>
        <Tab name='Filter'></Tab>
        <Tab name='Sort'>
          <List>
            {sortTypes.map((sortBy) => (
              <SortTypeItem {...rest} key={sortBy} selected={sortBy === sort} sortBy={sortBy} />
            ))}
          </List>
        </Tab>
      </Tabs>
    </Modal>
  );
};

export default React.memo(FilterModal);
