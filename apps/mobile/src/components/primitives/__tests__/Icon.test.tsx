import { render } from '@testing-library/react-native';
import Icon, { composedSizes } from '@/components/primitives/Icon';
import { lightTheme } from '@/providers/theme';

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
      <Icon type="icon" name="ab-testing" size={100} testID="numeric" />
    </>,
  );

  expect(tree.getByTestId('small')).toHaveStyle(composedSizes.icon.small);
  expect(tree.getByTestId('medium')).toHaveStyle(composedSizes.icon.medium);
  expect(tree.getByTestId('large')).toHaveStyle(composedSizes.icon.large);
  expect(tree.getByTestId('numeric')).toHaveProp('size', 100);

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

test('gets color type properly', () => {
  const tree = render(
    <Icon
      testID="icon"
      color="primary"
      type="icon"
      name="ab-testing"
      colorType="light"
    />,
  );
  const icon = tree.getByTestId('icon');
  expect(icon).toHaveStyle({ color: lightTheme.palette.primary.light });
});
