import React from 'react';
import { runOnUI } from 'react-native-reanimated';

export function createPanResponderHandler<Context>() {
  const context = React.useMemo(() => ({}), []) as Context;
  return function <T, K>(callback: (event: T, gestureState: K, context: Context) => void) {
    return (event: T, gestureState: K) => runOnUI(callback)(event, gestureState, context);
  };
}

export function createEventHandler<Context>() {
  const context = React.useMemo(() => ({}), []) as Context;

  return function <T>(callback: (event: T, context: Context) => void) {
    return (event: T) => runOnUI(callback)(event, context);
  };
}
