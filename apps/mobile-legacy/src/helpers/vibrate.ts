import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

export default function vibrate() {
  ReactNativeHapticFeedback.trigger('impactHeavy', {
    enableVibrateFallback: true,
  });
}
