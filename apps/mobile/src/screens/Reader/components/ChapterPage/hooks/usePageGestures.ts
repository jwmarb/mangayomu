import useMutableObject from '@hooks/useMutableObject';
import { useAppDispatch } from '@redux/main';
import { toggleImageModal } from '@redux/slices/reader';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import React from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

interface UsePageGesturesArgs {
  pageKey: string;
}

export default function usePageGestures(args: UsePageGesturesArgs) {
  const { pageKey } = args;
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

  const gestures = React.useMemo(() => holdGesture, [holdGesture, tapGesture]);
  return gestures;
}
