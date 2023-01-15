import { Platform, ToastAndroid } from 'react-native';
import Toast from 'react-native-root-toast';

const displayMessage = (msg: string) =>
  Platform.OS !== 'android'
    ? Toast.show(msg, {
        position: Toast.positions.BOTTOM,
        duration: Toast.durations.SHORT,
        animation: true,
        hideOnPress: true,
        delay: 0,
        shadow: true,
      })
    : ToastAndroid.show(msg, ToastAndroid.SHORT);

export default displayMessage;
