export interface TabButtonProps {
  index: number;
  tabName: string;
  onPress: (i: number) => void;
  selected: boolean;
  width: number;
}
