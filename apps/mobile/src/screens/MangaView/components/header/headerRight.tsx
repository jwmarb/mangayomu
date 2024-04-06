import { AnimatedHeaderComponentProps } from '@/components/composites/Header/Header';
import { AnimatedIcon } from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import useHeaderTextColor from '@/screens/MangaView/hooks/useHeaderTextColor';

export default function headerRight({
  scrollOffset,
}: AnimatedHeaderComponentProps) {
  const style = useHeaderTextColor(scrollOffset);
  return (
    <>
      <IconButton
        icon={
          <AnimatedIcon type="icon" name="bookmark-outline" style={style} />
        }
      />
      <IconButton
        icon={<AnimatedIcon type="icon" name="web" style={style} />}
      />
    </>
  );
}
