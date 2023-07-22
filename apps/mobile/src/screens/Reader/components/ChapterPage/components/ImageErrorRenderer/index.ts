export { default } from './ImageErrorRenderer';
import usePageRenderer from '@screens/Reader/components/ChapterPage/hooks/usePageRenderer';

export interface ImageErrorRendererProps {
  pageKey: string;
  onReload: () => void;
  style: Parameters<typeof usePageRenderer>[0]['style'];
}
