import useMutableObject from '@hooks/useMutableObject';
import { useAppDispatch } from '@redux/main';
import { toggleImageModal } from '@redux/slices/reader';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import React from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { SharedValue, runOnJS } from 'react-native-reanimated';

interface UsePageGesturesArgs {
  pageKey: string;
  pinchScale: SharedValue<number>;
}

export default function usePageGestures(args: UsePageGesturesArgs) {
  const { pageKey, pinchScale } = args;
  const mutablePageKey = useMutableObject(pageKey);
  const { tapGesture, imageMenuRef } = useChapterPageContext();
  const dispatch = useAppDispatch();
  const toggle = React.useCallback(
    () => dispatch(toggleImageModal()),
    [toggleImageModal, dispatch],
  );
  const openMenu = () => {
    if (imageMenuRef.current != null)
      imageMenuRef.current.setImageMenuPageKey(mutablePageKey.current);
  };
  const holdGesture = React.useMemo(
    () =>
      Gesture.LongPress().onStart(() => {
        runOnJS(openMenu)();
        runOnJS(toggle)();
      }),
    [toggle],
  );

  const pinchGesture = React.useMemo(
    () =>
      Gesture.Pinch().onChange((e) => {
        pinchScale.value = Math.max(pinchScale.value + e.scaleChange - 1, 1);
      }),
    [],
  );

  const gestures = React.useMemo(
    () => Gesture.Simultaneous(pinchGesture, holdGesture),
    [holdGesture, tapGesture],
  );
  return gestures;
}
