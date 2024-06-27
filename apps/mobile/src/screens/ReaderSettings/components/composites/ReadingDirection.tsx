import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import Icon from '@/components/primitives/Icon';
import SelectableOption from '@/screens/ReaderSettings/components/primitives/SelectableOption';
import useReaderSetting from '@/hooks/useReaderSetting';
import { ReadingDirection as Direction } from '@/models/schema';
import {
  SetStateProvider,
  useMangaContext,
  useSetState,
} from '@/screens/ReaderSettings/context';
import { OptionComponentProps } from '@/screens/ReaderSettings';
import React from 'react';
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
    alignItems: 'center',
  },
  horizontal: {
    flex: 1,
    flexDirection: 'row',
    gap: theme.style.size.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  vertical: {
    flex: 1,
    flexDirection: 'column',
    gap: theme.style.size.s,
    justifyContent: 'center',
    alignItems: 'center',
  },
  webtoon: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrow: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  manga: {
    borderRadius: theme.style.borderRadius.s,
    backgroundColor: theme.palette.skeleton,
    width: 20,
    height: 30,
  },
}));

export type ReadingDirectionProps = {
  type?: 'dense' | 'normal';
};

export default function ReadingDirection(props: ReadingDirectionProps) {
  const { type = 'normal' } = props;
  const manga = useMangaContext();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const { globalState, localState, setState } = useReaderSetting(
    'readingDirection',
    manga,
  );
  const state = manga != null ? localState : globalState;
  return (
    <View style={style.container}>
      <View style={style.title}>
        <Text variant="h4">Reading direction</Text>
        <Text variant="body2" color="textSecondary">
          Determines the page navigation behavior of the reader
        </Text>
      </View>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        horizontal
      >
        <SetStateProvider value={setState}>
          <View style={style.scrollViewContainer}>
            <UseGlobalSetting enum={Direction} localState={localState} />
            <LeftToRight
              isSelected={state === Direction.LEFT_TO_RIGHT}
              isGlobalSelected={globalState === Direction.LEFT_TO_RIGHT}
            />
            <RightToLeft
              isSelected={state === Direction.RIGHT_TO_LEFT}
              isGlobalSelected={globalState === Direction.RIGHT_TO_LEFT}
            />
            <Vertical
              isSelected={state === Direction.VERTICAL}
              isGlobalSelected={globalState === Direction.VERTICAL}
            />
            <Webtoon
              isSelected={state === Direction.WEBTOON}
              isGlobalSelected={globalState === Direction.WEBTOON}
            />
          </View>
        </SetStateProvider>
      </ScrollView>
    </View>
  );
}

function LeftToRight({ isSelected, isGlobalSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Left to right"
      selected={isSelected}
      globalSelected={isGlobalSelected}
      value={Direction.LEFT_TO_RIGHT}
      onSelect={setState}
    >
      <View style={style.horizontal}>
        <View style={style.manga} />
        <View style={style.manga} />
        <View style={style.arrow}>
          <Icon type="icon" name="arrow-right" size="small" color="secondary" />
        </View>
      </View>
    </SelectableOption>
  );
}

function RightToLeft({ isSelected, isGlobalSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Right to left"
      selected={isSelected}
      globalSelected={isGlobalSelected}
      value={Direction.RIGHT_TO_LEFT}
      onSelect={setState}
    >
      <View style={style.horizontal}>
        <View style={style.manga} />
        <View style={style.manga} />
        <View style={style.arrow}>
          <Icon type="icon" name="arrow-left" size="small" color="secondary" />
        </View>
      </View>
    </SelectableOption>
  );
}

function Vertical({ isSelected, isGlobalSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Vertical"
      selected={isSelected}
      value={Direction.VERTICAL}
      globalSelected={isGlobalSelected}
      onSelect={setState}
    >
      <View style={style.vertical}>
        <View style={style.manga} />
        <View style={style.manga} />
        <View style={style.arrow}>
          <Icon type="icon" name="arrow-down" size="small" color="secondary" />
        </View>
      </View>
    </SelectableOption>
  );
}

function Webtoon({ isSelected, isGlobalSelected }: OptionComponentProps) {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setState = useSetState();
  return (
    <SelectableOption
      title="Webtoon"
      selected={isSelected}
      value={Direction.WEBTOON}
      globalSelected={isGlobalSelected}
      onSelect={setState}
    >
      <View style={style.webtoon}>
        <View style={style.manga} />
        <View style={style.manga} />
      </View>
    </SelectableOption>
  );
}
