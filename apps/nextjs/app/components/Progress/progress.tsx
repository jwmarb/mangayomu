import useClassName, { OverrideClassName } from '@app/hooks/useClassName';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

export type ProgressProps = {
  size?: number;
} & OverrideClassName;

export default function Progress(props: ProgressProps) {
  const { size = 3 } = props;
  const className = useClassName('text-primary animate-spin', props);
  return (
    <AiOutlineLoading3Quarters
      style={{
        width: `${Math.sqrt(size)}rem`,
        height: `${Math.sqrt(size)}rem`,
      }}
      className={className}
    />
  );
}
