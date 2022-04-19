import { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Collapsible } from 'react-navigation-collapsible';
import { RecyclerListViewProps } from 'recyclerlistview';

export interface RecyclerListViewScreenProps extends RecyclerListViewProps {
  listener?: (e: NativeSyntheticEvent<NativeScrollEvent>) => void;
  collapsible: Collapsible;
}
