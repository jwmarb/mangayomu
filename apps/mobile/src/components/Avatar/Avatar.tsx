import Icon from '@components/Icon';
import { useUser } from '@realm/react';
import React from 'react';
import FastImage from 'react-native-fast-image';
import { moderateScale } from 'react-native-size-matters';

export interface AvatarProps {
  /**
   * The size of the avatar, which uses px units. For responsive layout, consider passing `moderatesScale(size)`
   */
  size?: number;
}

const Avatar: React.FC<AvatarProps> = (props) => {
  const { size = moderateScale(32) } = props;
  const user = useUser();
  const avatarStyle = React.useMemo(
    () => ({
      width: size,
      height: size,
      borderRadius: 10000,
    }),
    [size],
  );
  if (user.profile.pictureUrl == null)
    return <Icon type="font" size={size} name="account-circle" />;
  return (
    <FastImage source={{ uri: user.profile.pictureUrl }} style={avatarStyle} />
  );
};

export default Avatar;
