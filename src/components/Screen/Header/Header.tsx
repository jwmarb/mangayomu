import React from 'react';
import { HeaderBaseContainer, MangaSource } from './Header.base';
import { Typography } from '../../Typography';
import Spacer from '../../Spacer';
import Flex from '../../Flex';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import IconButton from '../../IconButton';
import { StackHeaderProps } from '@react-navigation/stack';
import Icon from '@components/Icon';

const BottomTabHeader: React.FC<BottomTabHeaderProps> = (props) => {
  const {
    options: { headerTitle = props.route.name, headerRight, headerLeft },
    navigation,
  } = props;
  const HeaderRightComponent = headerRight as React.FC;
  const HeaderLeftComponent = headerLeft as React.FC;

  return (
    <HeaderBaseContainer>
      {HeaderLeftComponent ? (
        <HeaderLeftComponent />
      ) : (
        <>
          <MangaSource />
          <Spacer x={1} />
        </>
      )}
      <Typography variant='subheader'>{headerTitle}</Typography>
      <Flex grow justifyContent='flex-end'>
        {HeaderRightComponent && <HeaderRightComponent />}
      </Flex>
    </HeaderBaseContainer>
  );
};

export const _BottomTabHeader = (props: BottomTabHeaderProps) => <BottomTabHeader {...props} />;

const Header: React.FC<StackHeaderProps> = (props) => {
  const {
    options: { headerTitle = props.route.name, headerRight, headerLeft },
    navigation,
  } = props;
  const HeaderRightComponent = headerRight as React.FC;
  const HeaderLeftComponent = headerLeft as React.FC;

  function handleOnPress() {
    navigation.goBack();
  }

  return (
    <HeaderBaseContainer>
      {HeaderLeftComponent ? (
        <>
          <HeaderLeftComponent />
          <Spacer x={1} />
        </>
      ) : (
        <>
          <IconButton icon={<Icon bundle='Feather' name='arrow-left' />} onPress={handleOnPress} />
          <Spacer x={1} />
        </>
      )}
      <Typography variant='subheader'>{headerTitle}</Typography>
      <Flex grow justifyContent='flex-end'>
        {HeaderRightComponent && <HeaderRightComponent />}
      </Flex>
    </HeaderBaseContainer>
  );
};

export const _Header = (props: StackHeaderProps) => <Header {...props} />;
