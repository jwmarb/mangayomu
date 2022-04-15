import { StackHeaderProps } from '@react-navigation/stack';
import React from 'react';
import { HeaderBaseContainer } from './Header.base';
import { Typography } from '../../Typography';
import IconButton from '../../IconButton';
import Icon from '../../Icon';
import Spacer from '../../Spacer';
import Flex from '../../Flex';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';

const Header: React.FC<BottomTabHeaderProps> = (props) => {
  const {
    options: { headerTitle = props.route.name, headerRight },
    navigation,
  } = props;
  const HeaderRightComponent = headerRight as React.FC;

  return (
    <HeaderBaseContainer>
      <Typography variant='subheader'>{headerTitle}</Typography>
      <Flex grow justifyContent='flex-end'>
        {HeaderRightComponent && <HeaderRightComponent />}
      </Flex>
    </HeaderBaseContainer>
  );
};

export default (props: BottomTabHeaderProps) => <Header {...props} />;
