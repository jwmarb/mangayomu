import React from 'react';
import { ImageElementProps } from './ImageElement.interfaces';
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
      resizeMode="contain"
    />
  );
};

export default ImageElement;
