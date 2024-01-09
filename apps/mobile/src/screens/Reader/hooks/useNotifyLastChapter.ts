import { LocalChapterSchema } from '@database/schemas/LocalChapter';
import displayMessage from '@helpers/displayMessage';
import useAppSelector from '@hooks/useAppSelector';
import React from 'react';

export default function useNotifyLastChapter(
  availableChapters: ArrayLike<LocalChapterSchema>,
  chapter: LocalChapterSchema,
) {
  const notifyOnLastChapter = useAppSelector(
    (state) => state.settings.reader.notifyOnLastChapter,
  );
  React.useEffect(() => {
    if (notifyOnLastChapter && availableChapters[0]._id === chapter._id)
      displayMessage('Final chapter');
  }, [notifyOnLastChapter, chapter._id]);
}
