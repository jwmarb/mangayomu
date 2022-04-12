import { StackHeaderProps } from '@react-navigation/stack';
import React from 'react';
import { HeaderBaseContainer } from './Header.base';
import { Typography, IconButton, Icon } from '@components/core';

const Header: React.FC<StackHeaderProps> = (props) => {
  const {
    options: { headerTitle = props.route.name },
    navigation,
  } = props;
  function handleOnBack() {
    navigation.goBack();
  }
  return (
    <HeaderBaseContainer>
      <IconButton icon={<Icon bundle='FontAwesome5' name='chevron-left' />} />
      <Typography variant='subheader' bold align='center'>
        {headerTitle}
      </Typography>
    </HeaderBaseContainer>
  );
};

export default (props: StackHeaderProps) => <Header {...props} />;
