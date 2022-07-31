import React from 'react';
import { FlatListProps } from 'react-native';
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import { RecyclerListViewProps } from 'recyclerlistview';
import { BackgroundColors } from '@theme/Color/Color.interfaces';

export interface ModalProps {
  visible: boolean;
  onClose: () => void;
  minimumHeight?: number;
  closeThreshold?: number;
  backdrop?: boolean;
  recyclerListView?: boolean;
  recyclerListViewProps?: RecyclerListViewProps;
  topColor?: keyof BackgroundColors;
  backgroundColor?: keyof BackgroundColors;
  disablePanning?: boolean;
}

export interface BackdropPressableProps {
  visible: boolean;
}

export interface StatusBarFillerProps {}

export type GestureContext = {
  translateY: number;
};
