import { FastImageElementProps } from '@screens/Reader/components/ChapterPage/components/FastImageElement/FastImageElement.interfaces';
import React from 'react';
import FastImage from 'react-native-fast-image';

const FastImageElement: React.FC<FastImageElementProps> = (props) => {
  const { uri, style, onError } = props;
  return (
    <FastImage
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
