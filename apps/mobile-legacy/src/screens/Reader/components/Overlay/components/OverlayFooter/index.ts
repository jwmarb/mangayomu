export { default } from './OverlayFooter';
export interface OverlayFooterProps {
  style: (
    | {
        transform: {
          translateY: number;
        }[];
      }
    | {
        opacity: number;
      }
  )[];
}
