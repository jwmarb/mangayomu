import { Manga as MangaType } from '@mangayomu/mangascraper';
import { AnimatedHeaderComponentProps } from '@/components/composites/Header/Header';
import { AnimatedIcon } from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import useHeaderTextColor from '@/screens/MangaView/hooks/useHeaderTextColor';
import useIsInLibrary from '@/screens/MangaView/hooks/useIsInLibrary';

export type HeaderRightProps = {
  manga: MangaType;
} & AnimatedHeaderComponentProps;

export default function headerRight({ scrollOffset, manga }: HeaderRightProps) {
  const style = useHeaderTextColor(scrollOffset);
  const [isInLibrary, setIsInLibrary] = useIsInLibrary(manga);

  function toggleSave() {
    setIsInLibrary((prev) => !prev);
  }
  return (
    <>
      <IconButton
        icon={
          <AnimatedIcon
            type="icon"
            name={isInLibrary ? 'bookmark' : 'bookmark-outline'}
            style={style}
          />
        }
        onPress={toggleSave}
      />
      <IconButton
        icon={<AnimatedIcon type="icon" name="web" style={style} />}
      />
    </>
  );
}
