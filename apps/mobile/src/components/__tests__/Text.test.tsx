import 'react-native';
import React from 'react';
import Text from '../Text';
import { it } from '@jest/globals';
import renderer from 'react-test-renderer';

jest.mock('react-native-mmkv', () => ({
  useMMKVBoolean: () => [undefined, undefined],
  MMKV: class MMKV {},
}));

jest.mock('../../hooks/useIsDarkMode', () => jest.fn());

it('renders correctly', () => {
  const tree = renderer.create(<Text>Hello World</Text>).toJSON();
  expect(tree).toMatchSnapshot();
  expect(tree).toHaveTextContent('Hello World');
});
