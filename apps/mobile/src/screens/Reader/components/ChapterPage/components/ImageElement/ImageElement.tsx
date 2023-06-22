import React from 'react';
import { ImageElementProps } from './ImageElement.interfaces';
import FastImage from 'react-native-fast-image';
import { Image } from 'react-native';

const ImageElement: React.FC<ImageElementProps> = (props) => {
  const { uri, style, onError } = props;
  return (
    <Image
      source={{
        uri,
      }}
      style={style}
      onError={onError}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
};

export default ImageElement;
