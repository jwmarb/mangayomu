import React from 'react';
import { HeaderBaseContainer, MangaSource } from './Header.base';
import { Typography } from '../../Typography';
import Spacer from '../../Spacer';
import Flex from '../../Flex';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { useSelector } from 'react-redux';
import { AppState, useAppDispatch } from '@redux/store';
import { Image } from 'react-native';
import IconButton from '../../IconButton';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import { Linking } from 'react-native';

const Header: React.FC<BottomTabHeaderProps> = (props) => {
  const {
    options: { headerTitle = props.route.name, headerRight },
    navigation,
  } = props;
  const HeaderRightComponent = headerRight as React.FC;

  return (
    <HeaderBaseContainer>
      <MangaSource />
      <Spacer x={1} />
      <Typography variant='subheader'>{headerTitle}</Typography>
      <Flex grow justifyContent='flex-end'>
        {HeaderRightComponent && <HeaderRightComponent />}
      </Flex>
    </HeaderBaseContainer>
  );
};

export default (props: BottomTabHeaderProps) => <Header {...props} />;
