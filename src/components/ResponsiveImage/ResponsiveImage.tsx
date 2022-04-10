import { ResponsiveImageBase, ResponsiveImageContainer } from '@components/ResponsiveImage/ResponsiveImage.base';
import { ResponsiveImageProps } from '@components/ResponsiveImage/ResponsiveImage.interface';
import React from 'react';

const ResponsiveImage: React.FC<ResponsiveImageProps> = (props) => {
  return (
    <ResponsiveImageContainer {...props}>
      <ResponsiveImageBase source={props.source} />
    </ResponsiveImageContainer>
  );
};

export default ResponsiveImage;
