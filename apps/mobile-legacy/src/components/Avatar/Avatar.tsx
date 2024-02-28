import Icon from '@components/Icon';
import ImprovedImage from '@components/ImprovedImage';
import { useUser } from '@realm/react';
import React from 'react';
import { Image } from 'react-native';
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
    <ImprovedImage
      source={{ uri: user.profile.pictureUrl }}
      style={avatarStyle}
    /> // ImprovedImage
  );
};

export default Avatar;
