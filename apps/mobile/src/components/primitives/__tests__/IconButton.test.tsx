import { render, userEvent } from '@testing-library/react-native';
import Icon from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test('renders correctly', () => {
  const tree = render(
    <IconButton icon={<Icon type="icon" name="ab-testing" />} />,
  );
  expect(tree).toMatchSnapshot();
});

test('proper interaction', async () => {
  const callback = jest.fn();
  const user = userEvent.setup();
  const { getByTestId } = render(
    <IconButton
      onPress={callback}
      icon={<Icon type="icon" name="ab-testing" />}
      testID="iconbtn"
    />,
  );

  await user.press(getByTestId('iconbtn'));

  jest.runOnlyPendingTimers();

  expect(callback).toHaveBeenCalled();
});
