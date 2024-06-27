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
  useMangaContext,
  useSetState,
} from '@/screens/ReaderSettings/context';
import { OptionComponentProps } from '@/screens/ReaderSettings';
import UseGlobalSetting from '@/screens/ReaderSettings/components/composites/UseGlobalSetting';

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
  const manga = useMangaContext();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const { localState, globalState, setState } = useReaderSetting(
    'zoomStartPosition',
    manga,
  );
  const state = manga == null ? globalState : localState;
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
            <UseGlobalSetting localState={localState} enum={Zoom} />
            <Automatic
              isSelected={state === Zoom.AUTOMATIC}
              isGlobalSelected={globalState === Zoom.AUTOMATIC}
            />
            <Left
              isSelected={state === Zoom.LEFT}
              isGlobalSelected={globalState === Zoom.LEFT}
            />
            <Center
              isSelected={state === Zoom.CENTER}
              isGlobalSelected={globalState === Zoom.CENTER}
            />
            <Right
              isSelected={state === Zoom.RIGHT}
              isGlobalSelected={globalState === Zoom.RIGHT}
            />
          </View>
        </SetStateProvider>
      </ScrollView>
    </View>
  );
}

function Automatic({ isSelected, isGlobalSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      globalSelected={isGlobalSelected}
      title="Automatic"
      selected={isSelected}
      value={Zoom.AUTOMATIC}
      onSelect={setState}
    ></SelectableOption>
  );
}

function Left({ isSelected, isGlobalSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      globalSelected={isGlobalSelected}
      title="Left"
      selected={isSelected}
      value={Zoom.LEFT}
      onSelect={setState}
    ></SelectableOption>
  );
}

function Right({ isSelected, isGlobalSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      globalSelected={isGlobalSelected}
      title="Fit Width"
      selected={isSelected}
      value={Zoom.RIGHT}
      onSelect={setState}
    ></SelectableOption>
  );
}

function Center({ isSelected, isGlobalSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      globalSelected={isGlobalSelected}
      title="Center"
      selected={isSelected}
      value={Zoom.CENTER}
      onSelect={setState}
    ></SelectableOption>
  );
}
