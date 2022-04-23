import { useNavigation } from '@react-navigation/native';
import React, { DependencyList } from 'react';

/**
 * Convert the dummy header into a stateful header, where the state of the screen can be manipulated through the header
 * @param customHeader The custom header component
 * @param deps Dependencies that dictate when the header should rerender
 */
export default function useStatefulHeader(customHeader: JSX.Element, deps?: DependencyList) {
  const navigation = useNavigation();

  React.useLayoutEffect(() => {
    navigation.setOptions({ header: () => customHeader });
  }, deps);
}
