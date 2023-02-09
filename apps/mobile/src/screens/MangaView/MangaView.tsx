import { RootStackProps } from '@navigators/Root/Root.interfaces';
import React from 'react';
import { View, Text } from 'react-native';

const MangaView: React.FC<RootStackProps<'MangaView'>> = (props) => {
  const {
    route: {
      params: { dbKey },
    },
    navigation,
  } = props;

  return (
    <View>
      <Text>Hello from MangaView</Text>
    </View>
  );
};

export default MangaView;
