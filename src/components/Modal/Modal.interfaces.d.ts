import React from 'react';
import { FlatListProps } from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { RecyclerListViewProps } from 'recyclerlistview';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  minimumHeight?: number;
  closeThreshold?: number;
  backdrop?: boolean;
  recyclerListView?: boolean;
  recyclerListViewProps?: RecyclerListViewProps;
}

export interface BackdropPressableProps {
  visible: boolean;
}

export interface StatusBarFillerProps {}

export type GestureContext = {
  translateY: number;
};
