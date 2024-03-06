import { render, userEvent } from '@testing-library/react-native';
import React from 'react';
import Pressable from '@/components/Pressable';

beforeAll(() => {
  jest.useFakeTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test('renders properly', async () => {
  const user = userEvent.setup();
  const handleOnPress = jest.fn();
  const handleOnLongPress = jest.fn();
  const tree = render(
    <Pressable onPress={handleOnPress} onLongPress={handleOnLongPress} />,
  );
  expect(tree).toMatchSnapshot();
  await user.press(tree.root);
  await user.longPress(tree.root);

  jest.runOnlyPendingTimers();
  expect(handleOnPress).toHaveBeenCalled();
  expect(handleOnLongPress).toHaveBeenCalled();
});
