import React from 'react';
import { HeaderBaseContainer } from './Header.base';
import { Typography } from '../../Typography';
import IconButton from '../../IconButton';
import Spacer from '../../Spacer';
import Flex from '../../Flex';
import { BottomTabHeaderProps } from '@react-navigation/bottom-tabs';
import { Image } from 'react-native';
import MangaSee from '@services/MangaSee';

const Header: React.FC<BottomTabHeaderProps> = (props) => {
  const {
    options: { headerTitle = props.route.name, headerRight },
    navigation,
  } = props;
  const HeaderRightComponent = headerRight as React.FC;

  return (
    <HeaderBaseContainer>
      <IconButton icon={<Image source={{ uri: MangaSee.icon }} style={{ width: 24, height: 24 }} />} />
      <Spacer x={1} />
      <Typography variant='subheader'>{headerTitle}</Typography>
      <Flex grow justifyContent='flex-end'>
        {HeaderRightComponent && <HeaderRightComponent />}
      </Flex>
    </HeaderBaseContainer>
  );
};

export default (props: BottomTabHeaderProps) => <Header {...props} />;
