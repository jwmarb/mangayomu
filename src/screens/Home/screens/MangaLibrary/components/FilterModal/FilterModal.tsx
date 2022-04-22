import { Icon, List, ListItem, Modal, Tab, Tabs } from '@components/core';
import { FilterModalProps } from '@screens/Home/screens/MangaLibrary/components/FilterModal/FilterModal.interfaces';
import React from 'react';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';

const FilterModal: React.FC<FilterModalProps> = (props) => {
  const { onClose, expand, tabIndex, setTabIndex, sortOptions } = props;
  return (
    <Modal onClose={onClose} visible={expand}>
      <Tabs onTabChange={setTabIndex} tabIndex={tabIndex}>
        <Tab name='Filter'></Tab>
        <Tab name='Sort'>{sortOptions}</Tab>
      </Tabs>
    </Modal>
  );
};

export default React.memo(FilterModal);
