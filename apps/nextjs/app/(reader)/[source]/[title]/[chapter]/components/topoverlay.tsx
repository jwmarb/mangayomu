import { useChapter } from '@app/(reader)/[source]/[title]/[chapter]/context/ChapterContext';
import { useManga } from '@app/(reader)/[source]/[title]/[chapter]/context/MangaContext';
import IconButton from '@app/components/IconButton';
import Text from '@app/components/Text';
import { animated } from '@react-spring/web';
import { useRouter } from 'next/navigation';
import React from 'react';
import { MdArrowBack } from 'react-icons/md';

type TopOverlayProps = React.ComponentProps<typeof animated.div>;

function TopOverlay(
  props: TopOverlayProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { style } = props;
  const chapter = useChapter();
  const manga = useManga();
  const router = useRouter();

  return (
    <animated.div
      ref={ref}
      style={style}
      className="flex flex-col gap-2 fixed left-0 right-0 top-0 bg-reader-overlay w-full z-10 py-2 px-3"
    >
      <IconButton icon={<MdArrowBack />} onPress={() => router.back()} />
      <div>
        <Text color="overlay-primary">{manga.title}</Text>
        <Text color="overlay-secondary">{chapter.name}</Text>
      </div>
    </animated.div>
  );
}

export default React.forwardRef(TopOverlay);
