import Icon from '../Icon';
export interface FloatingActionButtonProps {
  title: string;
  icon: React.ReactElement<typeof Icon>;
  expand?: boolean;
  onPress?: () => void;
}

export interface FloatingActionButtonRef {
  collapse(): void;
  expand(): void;
}
