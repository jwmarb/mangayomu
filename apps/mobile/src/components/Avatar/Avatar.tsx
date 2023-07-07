import Icon from '@components/Icon';
import useAuth0 from '@hooks/useAuth0';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { moderateScale } from 'react-native-size-matters';

export interface AvatarProps {
  size?: number;
}

const Avatar: React.FC<AvatarProps> = (props) => {
  const { size = moderateScale(32) } = props;
  const { user } = useAuth0();
  const avatarStyle = React.useMemo(
    () => ({
      width: size,
      height: size,
      borderRadius: 10000,
    }),
    [size],
  );
  if (user == null)
    return <Icon type="font" size={size} name="account-circle" />;
  return <FastImage source={{ uri: user.picture }} style={avatarStyle} />;
};

export default Avatar;
