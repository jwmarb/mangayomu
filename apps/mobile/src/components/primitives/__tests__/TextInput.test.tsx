import { render, userEvent } from '@testing-library/react-native';
import TextInput from '@/components/primitives/TextInput';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test('renders correctly', () => {
  const { root } = render(<TextInput />);
  expect(root).toMatchSnapshot();
});

test('clears text properly', async () => {
  let value = '';
  function onChangeText(e: string) {
    value = e;
  }
  const tree = render(
    <TextInput
      testID="input"
      onChangeText={onChangeText}
      closeButtonProps={{ testID: 'right' }}
    />,
  );
  const user = userEvent.setup();
  const inputEl = tree.getByTestId('input');

  await user.type(inputEl, 'hello world!');

  jest.runOnlyPendingTimers();

  expect(value).toEqual('hello world!');

  const clearInput = tree.getByTestId('right');

  await user.press(clearInput);

  expect(value).toEqual('');
});
