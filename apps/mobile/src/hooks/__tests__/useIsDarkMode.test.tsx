import { Appearance } from 'react-native';
import useIsDarkMode from '../useIsDarkMode';
import { render } from '@testing-library/react-native';

function Component() {
  const k = useIsDarkMode();
  return <>{JSON.stringify(k)}</>;
}

test('hook returns default when no provider', () => {
  expect(render(<Component />).toJSON()).toBe(
    (Appearance.getColorScheme() === 'dark') + '',
  );
});
