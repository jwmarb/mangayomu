import { render, userEvent } from '@testing-library/react-native';
import TextInput from '@/components/primitives/TextInput';
import Icon from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import { styles } from '@/components/primitives/TextInput/styles';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test('renders correctly', () => {
  const { root } = render(<TextInput />);
  expect(root).toBeOnTheScreen();
});

test('clears text properly', async () => {
  const onChangeText = jest.fn((e) => e);
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

  expect(onChangeText).toHaveReturnedWith('hello');
  expect(onChangeText).toHaveLastReturnedWith('hello world!');

  const clearInput = tree.getByTestId('right');

  await user.press(clearInput);

  jest.runOnlyPendingTimers();

  expect(onChangeText).toHaveLastReturnedWith('');

  expect(inputEl).toHaveStyle(styles[0].containerNoIcon);
});

test('displays icon & iconButton properly', async () => {
  const iconEl = <Icon type="icon" name="ab-testing" testID="icon" />;
  let tree = render(<TextInput icon={iconEl} testID="input" />);
  expect(tree.getByTestId('icon')).toBeOnTheScreen();
  expect(tree.getByTestId('input')).toHaveStyle(styles[0].container);

  const user = userEvent.setup();
  const onPress = jest.fn();
  tree = render(
    <TextInput
      icon={<IconButton icon={iconEl} onPress={onPress} testID="iconBtn" />}
      iconButton
      testID="input"
    />,
  );

  expect(tree.getByTestId('input')).toHaveStyle(styles[0].containerIconButton);

  await user.press(tree.getByTestId('iconBtn'));
  expect(onPress).toHaveBeenCalled();

  jest.runOnlyPendingTimers();
});
