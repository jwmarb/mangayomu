import Divider from './Divider';
export default Divider;
export interface DividerProps extends React.PropsWithChildren {
  orientation?: 'vertical' | 'horizontal';
}
