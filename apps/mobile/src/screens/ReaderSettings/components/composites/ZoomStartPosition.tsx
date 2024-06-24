import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import Icon from '@/components/primitives/Icon';
import SelectableOption from '@/screens/ReaderSettings/components/primitives/SelectableOption';
import useReaderSetting from '@/hooks/useReaderSetting';
import { ZoomStartPosition as Zoom } from '@/models/schema';
import {
  SetStateProvider,
  useSetState,
} from '@/screens/ReaderSettings/context';
import { OptionComponentProps } from '@/screens/ReaderSettings';

const styles = createStyles((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'column',
    gap: theme.style.size.m,
  },
  title: {
    paddingVertical: theme.style.size.m,
    paddingHorizontal: theme.style.screen.paddingHorizontal,
  },
  scrollViewContainer: {
    flex: 1,
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    flexDirection: 'row',
  },
}));

export type ZoomStartPositionProps = {
  type?: 'dense' | 'normal';
};

export default function ZoomStartPosition(props: ZoomStartPositionProps) {
  const { type = 'normal' } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const { globalState, setState } = useReaderSetting('zoomStartPosition');
  return (
    <View style={style.container}>
      <View style={style.title}>
        <Text variant="h4">Zoom start position</Text>
        <Text color="textSecondary" variant="body2">
          Determines where the starting pan position when an image is initially
          zoomed in
        </Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
      >
        <SetStateProvider value={setState}>
          <View style={style.scrollViewContainer}>
            <Automatic isSelected={globalState === Zoom.AUTOMATIC} />
            <Left isSelected={globalState === Zoom.LEFT} />
            <Center isSelected={globalState === Zoom.CENTER} />
            <Right isSelected={globalState === Zoom.RIGHT} />
          </View>
        </SetStateProvider>
      </ScrollView>
    </View>
  );
}

function Automatic({ isSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Automatic"
      selected={isSelected}
      value={Zoom.AUTOMATIC}
      onSelect={setState}
    ></SelectableOption>
  );
}

function Left({ isSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Left"
      selected={isSelected}
      value={Zoom.LEFT}
      onSelect={setState}
    ></SelectableOption>
  );
}

function Right({ isSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Fit Width"
      selected={isSelected}
      value={Zoom.RIGHT}
      onSelect={setState}
    ></SelectableOption>
  );
}

function Center({ isSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Center"
      selected={isSelected}
      value={Zoom.CENTER}
      onSelect={setState}
    ></SelectableOption>
  );
}
