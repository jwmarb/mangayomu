export { default as Button } from './button';
export { default as Header } from './header';
export { default as Category } from './category';
import BaseAccordion, { Content } from './accordion';

export const Accordion = BaseAccordion as typeof BaseAccordion & {
  Content: typeof Content;
};
