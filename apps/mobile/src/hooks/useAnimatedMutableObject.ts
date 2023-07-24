import { SharedValue, useSharedValue } from 'react-native-reanimated';

export default function useAnimatedMutableObject<T>(val: T) {
  const p = useSharedValue(val);
  p.value = val;
  return p;
}
