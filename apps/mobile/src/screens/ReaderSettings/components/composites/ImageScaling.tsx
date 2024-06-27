import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import Icon from '@/components/primitives/Icon';
import SelectableOption from '@/screens/ReaderSettings/components/primitives/SelectableOption';
import useReaderSetting from '@/hooks/useReaderSetting';
import { ImageScaling as Scaling } from '@/models/schema';
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

export type ImageScalingProps = {
  type?: 'dense' | 'normal';
};

export default function ImageScaling(props: ImageScalingProps) {
  const { type = 'normal' } = props;
  const manga = useMangaContext();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const { globalState, setState, localState } = useReaderSetting(
    'imageScaling',
    manga,
  );
  const state = manga == null ? globalState : localState;
  return (
    <View style={style.container}>
      <View style={style.title}>
        <Text variant="h4">Image scaling</Text>
        <Text variant="body2" color="textSecondary">
          Changes dimensions of images that exceed device dimensions when
          displayed on screen
        </Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
      >
        <SetStateProvider value={setState}>
          <View style={style.scrollViewContainer}>
            <UseGlobalSetting enum={Scaling} localState={localState} />
            <SmartFit
              isGlobalSelected={globalState === Scaling.SMART_FIT}
              isSelected={state === Scaling.SMART_FIT}
            />
            <FitScreen
              isGlobalSelected={globalState === Scaling.FIT_SCREEN}
              isSelected={state === Scaling.FIT_SCREEN}
            />
            <FitWidth
              isGlobalSelected={globalState === Scaling.FIT_WIDTH}
              isSelected={state === Scaling.FIT_WIDTH}
            />
            <FitHeight
              isGlobalSelected={globalState === Scaling.FIT_HEIGHT}
              isSelected={state === Scaling.FIT_HEIGHT}
            />
          </View>
        </SetStateProvider>
      </ScrollView>
    </View>
  );
}

function SmartFit({ isSelected, isGlobalSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Smart Fit"
      globalSelected={isGlobalSelected}
      selected={isSelected}
      value={Scaling.SMART_FIT}
      onSelect={setState}
    ></SelectableOption>
  );
}

function FitScreen({ isSelected, isGlobalSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Fit Screen"
      globalSelected={isGlobalSelected}
      selected={isSelected}
      value={Scaling.FIT_SCREEN}
      onSelect={setState}
    ></SelectableOption>
  );
}

function FitWidth({ isSelected, isGlobalSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Fit Width"
      globalSelected={isGlobalSelected}
      selected={isSelected}
      value={Scaling.FIT_WIDTH}
      onSelect={setState}
    ></SelectableOption>
  );
}

function FitHeight({ isSelected, isGlobalSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Fit Height"
      globalSelected={isGlobalSelected}
      selected={isSelected}
      value={Scaling.FIT_HEIGHT}
      onSelect={setState}
    ></SelectableOption>
  );
}
