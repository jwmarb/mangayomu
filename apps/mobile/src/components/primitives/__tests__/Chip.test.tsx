import { render, userEvent } from '@testing-library/react-native';
import Chip from '@/components/primitives/Chip';
import Icon from '@/components/primitives/Icon';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test('renders properly', () => {
  const tree = render(<Chip title="Hello World" />);
  expect(tree).toMatchSnapshot();
});

test('Is responsive', async () => {
  const onPress = jest.fn();
  const tree = render(<Chip testID="chip" onPress={onPress} title="Test" />);
  const user = userEvent.setup();

  await user.press(tree.getByTestId('chip'));

  expect(onPress).toHaveBeenCalled();

  jest.runOnlyPendingTimers();
});
