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

export function CodeSplitter(props: CodeSplitterProps) {
  const { children, isLoading } = props;

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <React.Suspense fallback={<LoadingComponent />}>{children}</React.Suspense>
  );
}

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
