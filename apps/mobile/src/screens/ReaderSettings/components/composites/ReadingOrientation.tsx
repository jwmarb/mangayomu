import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import Icon from '@/components/primitives/Icon';
import SelectableOption from '@/screens/ReaderSettings/components/primitives/SelectableOption';
import useReaderSetting from '@/hooks/useReaderSetting';
import { ReadingOrientation as Orientation } from '@/models/schema';
import { OptionComponentProps } from '@/screens/ReaderSettings';
import {
  SetStateProvider,
  useSetState,
} from '@/screens/ReaderSettings/context';
import { globals } from 'jest.config';

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
  cellphoneLandscape: {
    backgroundColor: theme.palette.skeleton,
    borderTopRightRadius: theme.style.borderRadius.s,
    borderBottomRightRadius: theme.style.borderRadius.s,
    height: 27,
    width: 31.5,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  cellphoneLandscapeOnly: {
    backgroundColor: theme.palette.skeleton,
    borderRadius: theme.style.borderRadius.s,
    width: 58.5,
    height: 31.5,
  },
  cellphonePortrait: {
    backgroundColor: theme.palette.skeleton,
    borderRadius: theme.style.borderRadius.s,
    width: 27,
    height: 58.5,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  cellPhonePortraitOnly: {
    backgroundColor: theme.palette.skeleton,
    borderRadius: theme.style.borderRadius.s,
    width: 27,
    height: 58.5,
    alignSelf: 'center',
  },
  cellphonePortraitNotch: {
    position: 'absolute',
    top: 2,
    alignSelf: 'center',
    width: 4,
    height: 4,
    backgroundColor: theme.palette.skeleton,
    borderRadius: 10000,
  },
  cellphonePortraitNavbar: {
    position: 'absolute',
    bottom: 2,
    height: 2,
    flexGrow: 1,
    marginHorizontal: theme.style.size.m,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.skeleton,
    borderRadius: 10000,
  },
  cellphoneLandscapeOnlyNavbar: {
    position: 'absolute',
    bottom: 2,
    width: 11,
    height: 2,
    alignSelf: 'center',
    backgroundColor: theme.palette.skeleton,
    borderRadius: 10000,
  },
  cellphoneLandscapeNotchContainer: {
    position: 'absolute',
    right: 2,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  cellphoneLandscapeNotch: {
    width: 4,
    height: 4,
    backgroundColor: theme.palette.skeleton,
    borderRadius: 10000,
  },
  cellphoneLandscapeNavbar: {
    height: 2,
    width: 8,
    position: 'absolute',
    bottom: 2,
    backgroundColor: theme.palette.skeleton,
    borderRadius: 10000,
  },
  cellphoneContainer: {
    width: 61,
    height: 70,
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
  },
  freeIcon: {
    position: 'absolute',
    right: 8,
    top: 16,
  },
  lock: {
    position: 'absolute',
    right: -theme.style.size.s,
    bottom: -theme.style.size.s,
  },
}));

export type ReadingOrientationProps = {
  type?: 'dense' | 'normal';
};

export default function ReadingOrientation(props: ReadingOrientationProps) {
  const { type = 'normal' } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const { globalState, setState } = useReaderSetting('readingOrientation');
  return (
    <View style={style.container}>
      <Text style={style.title} variant="h4">
        Reading orientation
      </Text>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
      >
        <SetStateProvider value={setState}>
          <View style={style.scrollViewContainer}>
            <Free isSelected={globalState === Orientation.FREE} />
            <Portrait isSelected={globalState === Orientation.PORTRAIT} />
            <Landscape isSelected={globalState === Orientation.LANDSCAPE} />
          </View>
        </SetStateProvider>
      </ScrollView>
    </View>
  );
}

function Portrait({ isSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      selected={isSelected}
      title="Portrait"
      value={Orientation.PORTRAIT}
      onSelect={setState}
    >
      <View style={style.cellphoneContainer}>
        <View style={style.cellPhonePortraitOnly}>
          <View style={style.cellphonePortraitNotch} />
          <View style={style.cellphonePortraitNavbar} />
          <Icon
            type="icon"
            name="crop-portrait"
            color="secondary"
            size="small"
            style={style.lock}
          />
        </View>
      </View>
    </SelectableOption>
  );
}

function Landscape({ isSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      selected={isSelected}
      title="Landscape"
      value={Orientation.LANDSCAPE}
      onSelect={setState}
    >
      <View style={style.cellphoneContainer}>
        <View style={style.cellphoneLandscapeOnly}>
          <View style={style.cellphoneLandscapeNotchContainer}>
            <View style={style.cellphoneLandscapeNotch} />
          </View>
          <View style={style.cellphoneLandscapeOnlyNavbar} />
          <Icon
            type="icon"
            name="crop-landscape"
            color="secondary"
            size="small"
            style={style.lock}
          />
        </View>
      </View>
    </SelectableOption>
  );
}

function Free({ isSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      selected={isSelected}
      title="Free (unlocked)"
      value={Orientation.FREE}
      onSelect={setState}
    >
      <View style={style.cellphoneContainer}>
        <Icon
          type="icon"
          name="arrow-down-right"
          color="secondary"
          style={style.freeIcon}
        />
        <View style={style.cellphoneLandscape}>
          <View style={style.cellphoneLandscapeNotchContainer}>
            <View style={style.cellphoneLandscapeNotch} />
          </View>
          <View style={style.cellphoneLandscapeNavbar} />
        </View>
        <View style={style.cellphonePortrait}>
          <View style={style.cellphonePortraitNotch} />
          <View style={style.cellphonePortraitNavbar} />
        </View>
      </View>
    </SelectableOption>
  );
}
