import { OverrideClassName } from '@app/hooks/useClassName';

export { default as Divider } from './Divider';
export interface DividerProps extends OverrideClassName {
  orientation?: 'vertical' | 'horizontal';
}
