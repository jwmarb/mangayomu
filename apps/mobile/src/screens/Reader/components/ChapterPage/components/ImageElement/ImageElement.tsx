import React from 'react';
import { ImageElementProps } from './ImageElement.interfaces';
import FastImage from 'react-native-fast-image';
import Animated from 'react-native-reanimated';

const ImageElement: React.FC<ImageElementProps> = (props) => {
  const { uri, style, onError } = props;
  return (
    <Animated.Image
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
