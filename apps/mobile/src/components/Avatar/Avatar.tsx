import Icon from '@components/Icon';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { moderateScale, ScaledSheet } from 'react-native-size-matters';
import { AvatarProps } from './Avatar.interfaces';

const Avatar: React.FC<AvatarProps> = (props) => {
  const { uri } = props;
  if (uri == null)
    return <Icon type="font" size={moderateScale(32)} name="account-circle" />;
  return <FastImage source={{ uri }} style={styles.avatar} />;
};

const styles = ScaledSheet.create({
  avatar: {
    width: '32@ms',
    height: '32@ms',
    borderRadius: 10000,
  },
});

export default Avatar;
