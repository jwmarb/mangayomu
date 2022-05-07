import { ScrollViewProps } from 'react-native';
import { Collapsible, UseCollapsibleOptions } from 'react-navigation-collapsible';

export interface ScreenProps {
  scrollable?: boolean | UseCollapsibleOptions;
  scrollViewProps?: ScrollViewProps;
  collapsible?: Collapsible;
}
