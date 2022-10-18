import { ProgressProps } from '@components/Progress/Progress.interfaces';
import Spinner from '@components/Progress/Spinner';
import Bar from '@components/Progress/Bar';

const Progress: React.FC<ProgressProps> = (props) => {
  const { type = 'spinner', ...rest } = props;
  switch (type) {
    case 'spinner':
      return <Spinner {...rest} />;
    case 'bar':
      return <Bar {...rest} />;
  }
};

export default Progress;
