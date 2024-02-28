import { BoxProps } from '@components/Box';
import Divider from './Divider';
export default Divider;
export interface DividerProps extends React.PropsWithChildren, BoxProps {
  orientation?: 'vertical' | 'horizontal';
  shrink?: boolean;
}
