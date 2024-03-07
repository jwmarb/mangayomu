import { render } from '@testing-library/react-native';
import Contrast from '@/components/primitives/Contrast';
import useContrast from '@/hooks/useContrast';
import Text from '@/components/primitives/Text';

function Consumer(props: { contrast?: boolean }) {
  const contrast = useContrast(props.contrast);

  return <Text testID="consumer">{JSON.stringify(contrast)}</Text>;
}

test('appropriately consumes context', () => {
  let tree = render(
    <Contrast>
      <Consumer />
    </Contrast>,
  );
  let text = tree.getByTestId('consumer');

  expect(text).toHaveTextContent('false');

  tree = tree = render(
    <Contrast contrast={false}>
      <Consumer />
    </Contrast>,
  );
  text = tree.getByTestId('consumer');

  expect(text).toHaveTextContent('false');

  tree = tree = render(
    <Contrast>
      <Consumer contrast={true} />
    </Contrast>,
  );
  text = tree.getByTestId('consumer');

  expect(text).toHaveTextContent('true');

  tree = tree = render(
    <Contrast contrast={false}>
      <Consumer contrast={true} />
    </Contrast>,
  );
  text = tree.getByTestId('consumer');

  expect(text).toHaveTextContent('false');
});
