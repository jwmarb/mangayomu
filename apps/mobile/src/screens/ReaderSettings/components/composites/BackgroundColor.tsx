import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { OptionComponentProps } from '@/screens/ReaderSettings';
import SelectableOption from '@/screens/ReaderSettings/components/primitives/SelectableOption';
import {
  SetStateProvider,
  useSetState,
} from '@/screens/ReaderSettings/context';
import {
  BackgroundColor as BGColor,
  useSettingsStore,
} from '@/stores/settings';
import { createStyles } from '@/utils/theme';
import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const styles = createStyles((theme) => ({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.style.size.m,
  },
  blockContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
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
  block: {
    width: 48,
    height: 48,
  },
  white: {
    backgroundColor: theme.palette.common.white,
  },
  black: {
    backgroundColor: theme.palette.common.black,
  },
  gray: {
    backgroundColor: theme.palette.common.gray,
  },
}));

export default function BackgroundColor() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const backgroundColor = useSettingsStore(
    (selector) => selector.reader.backgroundColor,
  );
  const setReaderState = useSettingsStore(
    (selector) => selector.setReaderState,
  );
  const setBackgroundColor = React.useCallback(
    (bgColor: BGColor) =>
      Promise.resolve(setReaderState('backgroundColor', bgColor)),
    [setReaderState],
  );
  const whiteBoxStyle = [style.block, style.white];
  const blackBoxStyle = [style.block, style.black];
  const grayBoxStyle = [style.block, style.gray];

  return (
    <View style={style.container}>
      <Text style={style.title} variant="h4">
        Background color
      </Text>
      <View style={style.blockContainer}>
        <SetStateProvider value={setBackgroundColor}>
          <Color
            value={BGColor.WHITE}
            style={whiteBoxStyle}
            isSelected={BGColor.WHITE === backgroundColor}
          />
          <Color
            value={BGColor.BLACK}
            style={blackBoxStyle}
            isSelected={BGColor.BLACK === backgroundColor}
          />
          <Color
            value={BGColor.GRAY}
            style={grayBoxStyle}
            isSelected={BGColor.GRAY === backgroundColor}
          />
        </SetStateProvider>
      </View>
    </View>
  );
}

type ColorProps = {
  style: StyleProp<ViewStyle>;
  value: BGColor;
} & OptionComponentProps;

function Color({ isSelected, style, value }: ColorProps) {
  const setBackgroundColor = useSetState();
  return (
    <SelectableOption
      noPadding
      hideTitle
      outline
      selected={isSelected}
      onSelect={setBackgroundColor}
      value={value}
    >
      <View style={style} />
    </SelectableOption>
  );
}
