import 'react-native';
import React from 'react';
import { it } from '@jest/globals';
import renderer from 'react-test-renderer';
import Text from '@/components/primitives/Text';

jest.mock('react-native-mmkv');

it('renders correctly', () => {
  const tree = renderer.create(<Text>Hello World</Text>).toJSON();
  expect(tree).toMatchSnapshot();
  expect(tree).toHaveTextContent('Hello World');
});
