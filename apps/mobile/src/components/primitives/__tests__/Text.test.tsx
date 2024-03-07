import 'react-native';
import React from 'react';
import { it } from '@jest/globals';
import { render } from '@testing-library/react-native';
import Text from '@/components/primitives/Text';

jest.mock('react-native-mmkv');

it('renders correctly', () => {
  const tree = render(<Text>Hello World</Text>);
  expect(tree).toMatchSnapshot();
  expect(tree.root).toHaveTextContent('Hello World');
});

it('correctly has styles', () => {
  const tree = render(
    <Text bold italic>
      Hello World
    </Text>,
  );
  expect(tree.root).toHaveStyle({ fontWeight: 'bold', fontStyle: 'italic' });
});
