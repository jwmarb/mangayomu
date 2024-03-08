import { render } from '@testing-library/react-native';
import Icon, { composedSizes } from '@/components/primitives/Icon';

jest.mock('react-native-vector-icons/MaterialCommunityIcons', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Text } = require('react-native');
    return <Text {...props}>icon</Text>;
  },
}));

test('renders properly', () => {
  let tree = render(<Icon type="icon" name="ab-testing" />);
  expect(tree).toMatchSnapshot();
  tree = render(<Icon type="image" uri="uri" />);
  expect(tree).toMatchSnapshot();
});

test('styles properly', () => {
  let tree = render(
    <>
      <Icon type="icon" name="ab-testing" size="small" testID="small" />
      <Icon type="icon" name="ab-testing" size="medium" testID="medium" />
      <Icon type="icon" name="ab-testing" size="large" testID="large" />
    </>,
  );

  expect(tree.getByTestId('small')).toHaveStyle(composedSizes.icon.small);
  expect(tree.getByTestId('medium')).toHaveStyle(composedSizes.icon.medium);
  expect(tree.getByTestId('large')).toHaveStyle(composedSizes.icon.large);

  tree = render(
    <>
      <Icon type="image" uri="uri" size="small" testID="small" />
      <Icon type="image" uri="uri" size="medium" testID="medium" />
      <Icon type="image" uri="uri" size="large" testID="large" />
    </>,
  );

  expect(tree.getByTestId('small')).toHaveStyle(composedSizes.image.small);
  expect(tree.getByTestId('medium')).toHaveStyle(composedSizes.image.medium);
  expect(tree.getByTestId('large')).toHaveStyle(composedSizes.image.large);
});
