import { OverrideClassName } from '@app/hooks/useClassName';

export { default as Accordion } from './accordion';
export interface AccordionProps
  extends React.PropsWithChildren,
    OverrideClassName {
  title: string;
  defaultOpened?: boolean;
}
