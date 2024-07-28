import { Dimensions, NativeModules, Platform, StatusBar } from 'react-native';
const { NavigationBarColor: UntypedeNavigationBarColor } = NativeModules;
const NavigationBarColor =
  UntypedeNavigationBarColor as NavigationBarColorInterface;
interface NavigationBarColorInterface {
  changeNavigationBarColor(
    color: string,
    light?: boolean,
    animated?: boolean,
  ): void;
  hideNavigationBar(): void;
  showNavigationBar(): void;
}

class NavigationBar {
  public readonly currentHeight: number = 0;
  constructor() {
    if (Platform.OS === 'android') {
      this.currentHeight =
        Dimensions.get('screen').height -
        Dimensions.get('window').height -
        (StatusBar.currentHeight ?? 0);
    }
  }
  hide() {
    if (Platform.OS === 'android') NavigationBarColor.hideNavigationBar();
  }
  show() {
    if (Platform.OS === 'android') NavigationBarColor.showNavigationBar();
  }
  changeColor(color: string, light = false, animated = false) {
    if (Platform.OS === 'android')
      NavigationBarColor.changeNavigationBarColor(color, light, animated);
  }
}

export default new NavigationBar();
