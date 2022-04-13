import { StackHeaderProps } from '@react-navigation/stack';
import React from 'react';
import { HeaderBaseContainer } from './Header.base';
import { Typography, IconButton, Icon, Spacer } from '@components/core';

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
      {navigation.canGoBack() && (
        <>
          <IconButton icon={<Icon bundle='FontAwesome5' name='chevron-left' />} onPress={handleOnBack} />
          <Spacer x={1} />
        </>
      )}
      <Typography variant='subheader'>{headerTitle}</Typography>
    </HeaderBaseContainer>
  );
};

export default (props: StackHeaderProps) => <Header {...props} />;
