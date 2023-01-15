import React from "react";
import { MangaProps } from "./Manga.interfaces";
import { Text, View } from "react-native";

const Manga: React.FC<MangaProps> = () => {
  return (
    <View>
      <Text>Manga Page</Text>
    </View>
  );
};

export default Manga;
