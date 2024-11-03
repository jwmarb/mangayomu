import Progress from '@/components/primitives/Progress';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import React from 'react';
import { View } from 'react-native';

const styles = createStyles(() => ({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

type CodeSplitterProps = React.PropsWithChildren<{
  isLoading?: boolean;
}>;

function LoadingComponent() {
  const style = useStyles(styles);

  return (
    <View style={style.container}>
      <Progress size="large" />
    </View>
  );
}

/**
 * A utility component that conditionally renders its children within a React Suspense boundary.
 * If `isLoading` is true, it displays a loading component. Otherwise, it wraps the children in a
 * Suspense boundary with the same loading component as the fallback.
 *
 * @param {CodeSplitterProps} props - The properties passed to the CodeSplitter component.
 * @param {React.ReactNode} props.children - The content to be rendered within the Suspense boundary.
 * @param {boolean} props.isLoading - A boolean flag indicating whether the component is in a loading state.
 *
 * @returns {JSX.Element} - The React element representing either the `LoadingComponent` or the children wrapped
 *                          in a Suspense boundary with a fallback of `LoadingComponent`.
 */
export function CodeSplitter(props: CodeSplitterProps) {
  const { children, isLoading } = props;

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <React.Suspense fallback={<LoadingComponent />}>{children}</React.Suspense>
  );
}

/**
 * A higher-order component (HOC) that wraps a dynamically imported React component with code splitting.
 * This function takes a factory function that returns a promise resolving to the default export of a React component.
 * The returned HOC uses `React.lazy` to lazily load the component and `CodeSplitter` to handle the code splitting logic.
 *
 * @param {() => Promise<{default: React.ComponentType<any>}>} factory - A function that returns a promise
 *   resolving to an object with a default property containing the React component to be lazily loaded.
 *
 * @returns {React.FC<Record<string, unknown>>} - A higher-order component (HOC) that wraps the dynamically imported
 *   component. The HOC takes props of type `Record<string, unknown>` and renders the wrapped component inside a
 *   `CodeSplitter` component.
 *
 * @example
 * import React from 'react';
 * import { withCodeSplitting } from './utils/codeSplit';
 *
 * const LazyComponent = withCodeSplitting(() => import('./components/MyComponent'));
 *
 * function App() {
 *   return (
 *     <div>
 *       <LazyComponent prop1="value1" prop2={42} />
 *     </div>
 *   );
 * }
 */
export function withCodeSplitting(
  factory: () => Promise<{
    default: React.ComponentType<any>;
  }>,
) {
  const Component = React.lazy(factory);

  return function WrappedComponent(props: Record<string, unknown>) {
    return (
      <CodeSplitter>
        <Component {...props} />
      </CodeSplitter>
    );
  };
}
