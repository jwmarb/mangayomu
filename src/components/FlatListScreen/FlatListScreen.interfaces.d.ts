import { FlatListProps } from 'react-native';
import { Collapsible } from 'react-navigation-collapsible';

export interface FlatListScreenProps<T> extends FlatListProps<T> {
  collapsible: Collapsible;
}
