import { withCodeSplitting } from '@/utils/codeSplit';

export default withCodeSplitting(() => import('./ReaderSettings'));

export type OptionComponentProps = {
  isSelected?: boolean;
  isGlobalSelected?: boolean;
};
