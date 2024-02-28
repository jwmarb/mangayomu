import Box from '@components/Box';
import Stack from '@components/Stack';
import Pressable from '@components/Pressable';
import useAppSelector from '@hooks/useAppSelector';
import { coverStyles } from '@components/Cover/Cover';
import { PressableProps } from '@components/Pressable';
import { BookStyle } from '@redux/slices/settings';

export default function PressableWrapper(
  props: React.PropsWithChildren<PressableProps>,
) {
  const { children, ...rest } = props;
  const width = useAppSelector((state) => state.settings.book.width);
  const height = useAppSelector((state) => state.settings.book.height);
  const bookStyle = useAppSelector((state) => state.settings.book.style);
  return (
    <Box align-self="center" overflow="hidden" style={coverStyles.button}>
      <Pressable foreground={bookStyle === BookStyle.TACHIYOMI} {...rest}>
        <Stack space="s" width={width} minHeight={height}>
          {children}
        </Stack>
      </Pressable>
    </Box>
  );
}
