import { FastImageElementProps } from '@screens/Reader/components/ChapterPage/components/FastImageElement/FastImageElement.interfaces';
import React from 'react';
import FastImage, { FastImageProps } from 'react-native-fast-image';
import Animated from 'react-native-reanimated';

const AnimatedFastImage = Animated.createAnimatedComponent(
  FastImage as React.FC<FastImageProps>,
);

const FastImageElement: React.FC<FastImageElementProps> = (props) => {
  const { uri, style, onError } = props;
  return (
    <AnimatedFastImage
      source={{
        uri,
      }}
      style={style}
      onError={onError}
      resizeMode={FastImage.resizeMode.contain}
    />
  );
};

export default FastImageElement;
