import 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';
import { ThemeProvider } from '../theme';
import useIsDarkMode from '../../hooks/useIsDarkMode';
import { Button, Text, View } from 'react-native';
import useDarkModeSetter from '../../hooks/useDarkModeSetter';
import React from 'react';
import { Appearance } from 'react-native';

jest.mock('react-native-mmkv', () => ({
  useMMKVBoolean: () => {
    return jest.requireActual('react').useState();
  },
  MMKV: class MMKV {},
}));

function ConsumerComponent() {
  const isDarkMode = useIsDarkMode();
  const setIsDarkMode = useDarkModeSetter();

  return (
    <View>
      <Text testID="isDarkMode">{isDarkMode ? 'Dark Mode' : 'Light Mode'}</Text>
      <Button title="toggle" onPress={() => setIsDarkMode((prev) => !prev)} />
    </View>
  );
}

test('renders correctly', () => {
  const tree = render(
    <ThemeProvider>
      <ConsumerComponent />
    </ThemeProvider>,
  );

  expect(tree).toMatchSnapshot();
});

test('provides theme correctly', () => {
  const { getByText, getByTestId } = render(
    <ThemeProvider>
      <ConsumerComponent />
    </ThemeProvider>,
  );

  expect(getByTestId('isDarkMode')).toHaveTextContent('Light Mode');
  fireEvent.press(getByText('toggle'));
  expect(getByTestId('isDarkMode')).toHaveTextContent('Dark Mode');
});

describe('with dark mode set as device theme', () => {
  beforeAll(() => {
    jest.spyOn(Appearance, 'getColorScheme').mockReturnValue('dark');
  });
  it('renders with dark mode', () => {
    const tree = render(
      <ThemeProvider>
        <ConsumerComponent />
      </ThemeProvider>,
    );
    expect(tree.getByTestId('isDarkMode')).toHaveTextContent('Dark Mode');
  });
});
