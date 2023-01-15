import ButtonBase from '@components/Button/ButtonBase';
import Flex from '@components/Flex';
import { Typography } from '@components/Typography';
import React from 'react';
import { LayoutChangeEvent } from 'react-native';
import { TabButtonContainer } from '../Tabs.base';
import { TabButtonBaseContainer } from './TabButton.base';
import { TabButtonProps } from './TabButton.interfaces';

const TabButton: React.FC<TabButtonProps> = (props) => {
  const { onPress, index, tabName, selected, width } = props;
  function handleOnPress() {
    onPress(index);
  }
  return (
    <TabButtonBaseContainer width={width}>
      <ButtonBase expand color='primary' square onPress={handleOnPress}>
        <TabButtonContainer>
          <Typography variant='button' align='center' color={selected ? 'primary' : 'textPrimary'}>
            {tabName}
          </Typography>
        </TabButtonContainer>
      </ButtonBase>
    </TabButtonBaseContainer>
  );
};

export default React.memo(TabButton);
