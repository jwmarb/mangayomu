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

export type ImageScalingProps = {
  type?: 'dense' | 'normal';
};

export default function ImageScaling(props: ImageScalingProps) {
  const { type = 'normal' } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const { globalState, setState } = useReaderSetting('imageScaling');
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
            <SmartFit isSelected={globalState === Scaling.SMART_FIT} />
            <FitScreen isSelected={globalState === Scaling.FIT_SCREEN} />
            <FitWidth isSelected={globalState === Scaling.FIT_WIDTH} />
            <FitHeight isSelected={globalState === Scaling.FIT_HEIGHT} />
          </View>
        </SetStateProvider>
      </ScrollView>
    </View>
  );
}

function SmartFit({ isSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Smart Fit"
      selected={isSelected}
      value={Scaling.SMART_FIT}
      onSelect={setState}
    ></SelectableOption>
  );
}

function FitScreen({ isSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Fit Screen"
      selected={isSelected}
      value={Scaling.FIT_SCREEN}
      onSelect={setState}
    ></SelectableOption>
  );
}

function FitWidth({ isSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Fit Width"
      selected={isSelected}
      value={Scaling.FIT_WIDTH}
      onSelect={setState}
    ></SelectableOption>
  );
}

function FitHeight({ isSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Fit Height"
      selected={isSelected}
      value={Scaling.FIT_HEIGHT}
      onSelect={setState}
    ></SelectableOption>
  );
}
