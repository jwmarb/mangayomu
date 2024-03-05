import { render } from '@testing-library/react-native';
import useDarkModeSetter from '../useDarkModeSetter';
// import useIsDarkMode from '../useIsDarkMode';
import { Button, Text, View } from 'react-native';
import useIsDarkMode from '../useIsDarkMode';
import { ThemeProvider } from '../../providers/theme';

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(jest.fn());
});

function DarkModeComponentSetter() {
  const setIsDarkMode = useDarkModeSetter();
  const isDarkMode = useIsDarkMode();
  return (
    <View>
      <Text testID="isDarkMode">{JSON.stringify(isDarkMode)}</Text>
      <Button title="toggle" onPress={() => setIsDarkMode((prev) => !prev)} />
    </View>
  );
}

test('hook throws error when no provider', () => {
  expect(() => render(<DarkModeComponentSetter />)).toThrow();
  expect(console.error).toHaveBeenCalled(); // console error gets called when render throws
});

test('hook sets dark mode correctly', () => {
  const tree = render(
    <ThemeProvider>
      <DarkModeComponentSetter />
    </ThemeProvider>,
  );

  expect(tree.getByTestId('isDarkMode')).toHaveTextContent('false');
});
