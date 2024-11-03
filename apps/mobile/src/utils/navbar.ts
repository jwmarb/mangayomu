import { Dimensions, NativeModules, Platform, StatusBar } from 'react-native';

// Importing NavigationBarColor from NativeModules and type-casting it to NavigationBarColorInterface
const { NavigationBarColor: UntypedeNavigationBarColor } = NativeModules;
const NavigationBarColor =
UntypedeNavigationBarColor as NavigationBarColorInterface;

// Defining the interface for NavigationBarColor with methods to change, hide, and show the navigation bar color
interface NavigationBarColorInterface {
  // Changes the navigation bar color with optional parameters for light mode and animation
  changeNavigationBarColor(
    color: string,
    light?: boolean,
    animated?: boolean,
  ): void;

  // Hides the navigation bar
  hideNavigationBar(): void;

  // Shows the navigation bar
  showNavigationBar(): void;
}

/**
 * A utility class to manage the navigation bar on Android devices.
 * This class provides methods to hide, show, and change the color of the navigation bar.
 * The navigation bar height is determined during initialization based on the platform.
 */
class NavigationBar {
  /**
   * The current height of the navigation bar.
   * This value is set during the constructor call if the application is running on an Android device.
   */
  public readonly currentHeight: number = 0;

  /**
   * Initializes a new instance of the `NavigationBar` class.
   * If the platform is Android, it calculates and sets the height of the navigation bar.
   *
   * @pre    The application must be initialized.
   * @post   The `currentHeight` property is set to the correct value for Android devices; otherwise, it remains 0.
   */
  constructor() {
    if (Platform.OS === 'android') {
      this.currentHeight =
        Dimensions.get('screen').height -
        Dimensions.get('window').height -
        (StatusBar.currentHeight ?? 0);
    }
  }

  /**
   * Hides the navigation bar on Android devices.
   *
   * @pre    The application is running on an Android device.
   * @post   The navigation bar is hidden if the platform is Android.
   */
  hide() {
    if (Platform.OS === 'android') NavigationBarColor.hideNavigationBar();
  }

  /**
   * Shows the navigation bar on Android devices.
   *
   * @pre    The application is running on an Android device.
   * @post   The navigation bar is shown if the platform is Android.
   */
  show() {
    if (Platform.OS === 'android') NavigationBarColor.showNavigationBar();
  }

  /**
   * Changes the color of the navigation bar on Android devices.
   *
   * @param {string} color - The new color for the navigation bar. This should be a valid color string.
   * @param {boolean} [light=false] - Whether to use a light theme for the navigation bar icons.
   * @param {boolean} [animated=false] - Whether the color change should be animated.
   *
   * @pre    The application is running on an Android device.
   * @post   The navigation bar's color is changed to the specified color if the platform is Android.
   */
  changeColor(color: string, light = false, animated = false) {
    if (Platform.OS === 'android')
      NavigationBarColor.changeNavigationBarColor(color, light, animated);
  }
}

export default new NavigationBar();
