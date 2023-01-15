import { Typography } from '@components/core';
import React from 'react';
import { Dimensions, Image, PanResponder, useWindowDimensions, View } from 'react-native';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';
import { PagePanGestureContext, PagePinchGestureContext, PageProps, PanResponderContext } from './Page.interfaces';
import * as Clipboard from 'expo-clipboard';
import { convertToURI } from '@screens/MangaViewer/components/MangaCover/MangaCover.helpers';
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';
import displayMessage from '@utils/displayMessage';
import connector, { ConnectedPageProps } from '@screens/Reader/components/Page/Page.redux';
import { Manga } from '@services/scraper/scraper.interfaces';
import { ReaderDirection } from '@redux/reducers/settingsReducer/settingsReducer.constants';
import { Orientation, SizeClassIOS } from 'expo-screen-orientation';
import * as ExpoOrientation from 'expo-screen-orientation';
import { PageContainer } from '@screens/Reader/components/Page/Page.base';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  runOnUI,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDecay,
  withTiming,
} from 'react-native-reanimated';
import {
  GestureEvent,
  TapGestureHandler,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PinchGestureHandler,
  PinchGestureHandlerEventPayload,
  TouchableWithoutFeedback,
  NativeViewGestureHandler,
  PanGestureHandlerEventPayload,
  GestureUpdateEvent,
  GestureEventPayload,
  HandlerStateChangeEventPayload,
  GestureHandlerRootView,
  TapGestureHandlerEventPayload,
  LongPressGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import { withAnchorPoint } from 'react-native-anchor-point';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { createPanResponderHandler, createEventHandler } from './Page.helpers';
import useMountedEffect from '@hooks/useMountedEffect';
import {
  ImageScaling,
  ZoomStartPosition,
} from '@redux/reducers/readerSettingProfileReducer/readerSettingProfileReducer.constants';
import HorizontalPage from '@screens/Reader/components/Page/HorizontalPage';
import WebtoonPage from '@screens/Reader/components/Page/WebtoonPage';

const Page: React.FC<ConnectedPageProps> = (props) => {
  const { readerDirection, shouldTrackIndex } = props;

  if (!shouldTrackIndex) return null;

  switch (readerDirection) {
    case ReaderDirection.LEFT_TO_RIGHT:
    case ReaderDirection.RIGHT_TO_LEFT:
    default:
      return <HorizontalPage {...props} />;
    case ReaderDirection.WEBTOON:
      return <WebtoonPage {...props} />;
  }
};

export default connector(Page);
