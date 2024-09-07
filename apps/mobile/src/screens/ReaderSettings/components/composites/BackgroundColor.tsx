import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { OptionComponentProps } from '@/screens/ReaderSettings';
import MiscellaneousOption from '@/screens/ReaderSettings/components/primitives/MiscellaneousOption';
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

const styles = createStyles((theme) => ({
  blockContainer: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  block: {
    width: 36,
    height: 36,
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
    <MiscellaneousOption>
      <MiscellaneousOption.Title title="Background color" />
      <MiscellaneousOption.Content style={style.blockContainer}>
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
      </MiscellaneousOption.Content>
    </MiscellaneousOption>
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
