export { default } from './SkipButton';
export type SkipButtonProps = {
  onSkip: () => void;
} & (
  | {
      previous: boolean;
    }
  | { next: boolean }
);
