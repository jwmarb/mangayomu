import { render } from '@testing-library/react-native';
import Text from '@/components/Text';
import { lightTheme, darkTheme } from '@/providers/theme';
import Contrast from '@/components/Contrast';

test('passes context correctly', () => {
  let tree = render(
    <Contrast>
      <Text testID="text">Hello World</Text>
    </Contrast>,
  );

  let text = tree.getByTestId('text');
  expect(text).toHaveStyle({ color: lightTheme.palette.text.primary });

  tree = render(
    <Contrast contrast>
      <Text testID="text">Hello World</Text>
    </Contrast>,
  );

  text = tree.getByTestId('text');

  expect(text).toHaveStyle({ color: darkTheme.palette.text.primary });
});
