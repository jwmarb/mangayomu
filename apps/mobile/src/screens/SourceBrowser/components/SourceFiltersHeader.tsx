import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/primitives/Button';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';

type SourceFiltersHeaderProps = {
  onResetFilters: () => void;
  onApplyFilters: () => void;
};

const styles = createStyles((theme) => ({
  container: {
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    paddingVertical: theme.style.size.l,
    gap: theme.style.size.m,
    left: 0,
    right: 0,
    bottom: 0,
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function SourceFiltersHeader(props: SourceFiltersHeaderProps) {
  const { onResetFilters, onApplyFilters } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);

  return (
    <SafeAreaView edges={['bottom']} style={style.container}>
      <Button
        textAlignment="center"
        title="Apply"
        variant="contained"
        onPress={onApplyFilters}
      />
      <Button
        textAlignment="center"
        title="Reset"
        variant="outlined"
        onPress={onResetFilters}
      />
    </SafeAreaView>
  );
}
