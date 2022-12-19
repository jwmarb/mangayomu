export type TabsProps = React.PropsWithChildren<{
  tabIndex: number;
  onTabChange: (i: number) => void;
}>;
