import { Appearance } from 'react-native';
import { render } from '@testing-library/react-native';
import useIsDarkMode from '@/hooks/useIsDarkMode';

function Component() {
  const k = useIsDarkMode();
  return <>{JSON.stringify(k)}</>;
}

test('hook returns default when no provider', () => {
  expect(render(<Component />).toJSON()).toBe(
    (Appearance.getColorScheme() === 'dark') + '',
  );
});
