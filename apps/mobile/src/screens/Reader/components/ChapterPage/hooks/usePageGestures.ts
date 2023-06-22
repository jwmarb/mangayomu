import { useAppDispatch } from '@redux/main';
import { toggleImageModal } from '@redux/slices/reader';
import { useChapterPageContext } from '@screens/Reader/components/ChapterPage/context/ChapterPageContext';
import React from 'react';
import { Gesture } from 'react-native-gesture-handler';
import { runOnJS } from 'react-native-reanimated';

export default function usePageGestures() {
  const { tapGesture } = useChapterPageContext();
  const dispatch = useAppDispatch();
  const toggle = React.useCallback(
    () => dispatch(toggleImageModal()),
    [toggleImageModal, dispatch],
  );
  const holdGesture = React.useMemo(
    () =>
      Gesture.LongPress().onStart(() => {
        runOnJS(toggle)();
      }),
    [toggle],
  );

  const gestures = React.useMemo(() => holdGesture, [holdGesture, tapGesture]);
  return gestures;
}
