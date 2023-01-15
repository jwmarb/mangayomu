import React from "react";
import { StatusBar, useColorScheme } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import RootStack from "@navigators/RootNavigator";
import Home from "@screens/Home";
import Manga from "@screens/Manga/Manga";

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === "dark";

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        translucent
        backgroundColor="transparent"
      />
      <RootStack.Navigator>
        <RootStack.Screen name="Home" component={Home} />
        <RootStack.Screen name="Manga" component={Manga} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
