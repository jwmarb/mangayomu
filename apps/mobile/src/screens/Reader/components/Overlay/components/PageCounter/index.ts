export { default } from './PageCounter';
export interface PageCounterProps {
  page?: number;
  totalPages?: number;
  pageCounterStyle: {
    opacity: number;
  };
}
