import { render, userEvent } from '@testing-library/react-native';
import Button from '@/components/primitives/Button';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test('renders properly', () => {
  let tree = render(<Button title="My Button Component" />);
  expect(tree).toMatchSnapshot();

  tree = render(<Button title="My Button Component" variant="contained" />);
  expect(tree).toMatchSnapshot();

  tree = render(<Button title="My Button Component" variant="outlined" />);
  expect(tree).toMatchSnapshot();
});

test('interaction works', async () => {
  const onPress = jest.fn();
  const onLongPress = jest.fn();
  const user = userEvent.setup();
  const tree = render(
    <Button
      title="My Button Component"
      onPress={onPress}
      onLongPress={onLongPress}
      testID="btn"
    />,
  );

  const button = tree.getByTestId('btn');
  await user.press(button);
  await user.longPress(button);

  jest.runOnlyPendingTimers();
  expect(onPress).toHaveBeenCalled();
  expect(onLongPress).toHaveBeenCalled();
});
