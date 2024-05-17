import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import React from 'react';
import { View } from 'react-native';
import BottomSheet from '@/components/composites/BottomSheet';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import SourceItem from '@/screens/Home/tabs/Library/components/primitives/SourceItem';
import Chip from '@/components/primitives/Chip';
import Icon from '@/components/primitives/Icon';
import Modal from '@/components/composites/Modal';
import LibraryFilterGenreMenu, {
  LibraryFilterGenreMenuProps,
} from '@/screens/Home/tabs/Library/components/filter/LibraryFilterGenreMenu';

export const styles = createStyles((theme) => ({
  sectionTitle: {
    paddingHorizontal: theme.style.screen.paddingHorizontal * 2,
    paddingVertical: theme.style.size.m,
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.style.size.s,
  },
  genresContainer: {
    flexDirection: 'row',
    gap: theme.style.size.s,
    alignItems: 'center',
    paddingHorizontal: theme.style.screen.paddingHorizontal * 2,
    flexWrap: 'wrap',
  },
}));

export type LibraryFilterMenuProps = {
  sources: string[];
  mangasPerSource?: Record<string, number>;
  showSource?: Record<string, boolean>;
  onCheckSource: (title: string, value: boolean) => void;
  onFilter: LibraryFilterGenreMenuProps['onFilter'];
};

function LibraryFilterMenu(
  props: LibraryFilterMenuProps,
  ref: React.ForwardedRef<BottomSheet>,
) {
  const { sources, mangasPerSource, showSource, onCheckSource, onFilter } =
    props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const modalRef = React.useRef<Modal>(null);

  const [chips, setChips] = React.useState<React.ReactNode[]>([]);

  function handleOnPress() {
    modalRef.current?.show();
  }

  return (
    <>
      <BottomSheet ref={ref}>
        <BottomSheetScrollView>
          <View style={style.sectionTitle}>
            <Text>Sources</Text>
            <Text color="textSecondary" variant="body2">
              ({sources.length})
            </Text>
          </View>
          {sources.map((x) => (
            <SourceItem
              key={x}
              checked={showSource?.[x] ?? true}
              onChecked={onCheckSource}
              subtitle={`(${mangasPerSource?.[x]})`}
              title={x}
            />
          ))}
          <Text style={style.sectionTitle}>Genres</Text>
          <View style={style.genresContainer}>
            <Chip
              title="Add filter"
              icon={<Icon type="icon" name="plus" />}
              onPress={handleOnPress}
            />
            {chips}
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
      <LibraryFilterGenreMenu
        onFilter={onFilter}
        onChips={setChips}
        sources={sources}
        ref={modalRef}
      />
    </>
  );
}

export default React.forwardRef(LibraryFilterMenu);
