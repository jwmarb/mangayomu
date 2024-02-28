import { Platform, ToastAndroid } from 'react-native';
import Toast from 'react-native-simple-toast';

/**
 * Display a popup toast to the user
 * @param text The text to display
 */
export default function displayMessage(text: string) {
  if (Platform.OS === 'ios') Toast.show(text, 3);
  else if (Platform.OS === 'android')
    ToastAndroid.show(text, ToastAndroid.SHORT);
}
