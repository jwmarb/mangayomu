import { useIndex } from '@app/(root)/[source]/[title]/[chapter]/context/IndexContext';
import { usePagesContext } from '@app/(root)/[source]/[title]/[chapter]/context/PagesContext';
import Text from '@app/components/Text';
import { animated } from '@react-spring/web';
type PageCounterProps = React.ComponentProps<typeof animated.div>;

export default function PageCounter(props: PageCounterProps) {
  const index = useIndex();
  const pages = usePagesContext();

  return (
    <animated.div
      style={props.style}
      className="fixed left-0 right-0 flex flex-grow items-center justify-center pointer-events-none"
    >
      <Text
        color="overlay-primary"
        className="bg-reader-overlay px-1 rounded font-medium"
        variant="sm-label"
      >
        {index + 1} / {pages}
      </Text>
    </animated.div>
  );
}
