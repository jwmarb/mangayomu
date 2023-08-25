import { useChapter } from '@app/(reader)/[source]/[title]/[chapter]/context/ChapterContext';
import { useManga } from '@app/(reader)/[source]/[title]/[chapter]/context/MangaContext';
import IconButton from '@app/components/IconButton';
import Text from '@app/components/Text';
import useObject from '@app/hooks/useObject';
import MangaSchema from '@app/realm/Manga';
import { animated } from '@react-spring/web';
import { useRouter } from 'next/navigation';
import React from 'react';
import {
  MdArrowBack,
  MdBookmark,
  MdBookmarkBorder,
  MdSettings,
} from 'react-icons/md';

type TopOverlayProps = React.ComponentProps<typeof animated.div>;

function TopOverlay(
  props: TopOverlayProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { style } = props;
  const chapter = useChapter();
  const manga = useManga();
  const userManga = useObject(
    MangaSchema,
    React.useMemo(() => ({ link: manga.link }), [manga.link]),
  );
  const router = useRouter();
  function handleOnPressBookmark() {
    userManga.update((draft) => {
      draft.inLibrary = !draft.inLibrary;
    });
  }
  function handleOnPressBack() {
    router.back();
  }

  function handleOnPressTitle() {
    router.push(manga._id);
  }

  return (
    <animated.div
      ref={ref}
      style={style}
      className="flex flex-col gap-2 fixed left-0 right-0 top-0 bg-reader-overlay w-full z-10 py-2 px-3"
    >
      <div className="flex flex-row gap-2 justify-between items-center">
        <IconButton icon={<MdArrowBack />} onPress={handleOnPressBack} />
        <div className="flex flex-row gap-2 items-center">
          <IconButton
            icon={userManga.inLibrary ? <MdBookmark /> : <MdBookmarkBorder />}
            onPress={handleOnPressBookmark}
          />
          <IconButton icon={<MdSettings />} />
        </div>
      </div>
      <div>
        <Text
          color="overlay-primary"
          className="line-clamp-2"
          onClick={handleOnPressTitle}
        >
          {manga.title}
        </Text>
        <Text color="overlay-secondary">{chapter.name}</Text>
      </div>
    </animated.div>
  );
}

export default React.forwardRef(TopOverlay);