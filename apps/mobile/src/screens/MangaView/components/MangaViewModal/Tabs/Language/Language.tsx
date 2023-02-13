import Box from '@components/Box';
import Icon from '@components/Icon';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import { useManga } from '@database/schemas/Manga';
import { useTheme } from '@emotion/react';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import React from 'react';
import { ListRenderItem } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
} from 'react-native-reanimated';
import { moderateScale } from 'react-native-size-matters';
import { LanguageProps } from './Language.interfaces';

const Language: React.FC<LanguageProps> = (props) => {
  const { selectedLanguage, supportedLanguages, mangaLink } = props;
  const { update } = useManga(mangaLink);
  const handleOnChange = React.useCallback(
    (i: ISOLangCode | 'Use default language') => {
      update((obj) => {
        obj.selectedLanguage = i;
      });
    },
    [update],
  );
  const renderItem = React.useCallback<
    ListRenderItem<ISOLangCode | 'Use default language'>
  >(
    ({ item }) => (
      <Item
        isSelected={selectedLanguage === item}
        title={item in languages ? languages[item as ISOLangCode].name : item}
        itemKey={item}
        onChange={handleOnChange}
      />
    ),
    [selectedLanguage, handleOnChange],
  );
  const data = React.useMemo(
    () => ['Use default language', ...supportedLanguages],
    [supportedLanguages],
  ) as (ISOLangCode | 'Use default language')[];
  return (
    <BottomSheetFlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      ListFooterComponent={<Box mb={moderateScale(100)} />}
    />
  );
};

const keyExtractor = (i: ISOLangCode | 'Use default language') => i;

interface SelectItemProps<T extends string> {
  isSelected: boolean;
  title: string;
  itemKey: T;
  onChange: (itemKey: T) => void;
}

function SelectItem<T extends string>(props: SelectItemProps<T>) {
  const theme = useTheme();
  const textColor = useDerivedValue(() =>
    interpolateColor(
      props.isSelected ? 1 : 0,
      [0, 1],
      [theme.palette.text.secondary, theme.palette.primary.main],
    ),
  );
  const textStyle = useAnimatedStyle(() => ({
    color: textColor.value,
  }));
  const iconStyle = useAnimatedStyle(() => ({
    opacity: props.isSelected ? 1 : 0,
  }));
  function handleOnPress() {
    props.onChange(props.itemKey);
  }
  return (
    <RectButton onPress={handleOnPress}>
      <Stack p="m" space="m" flex-direction="row" align-items="center">
        <Animated.View style={iconStyle}>
          <Icon type="font" name="check" color="primary" />
        </Animated.View>
        <Text as={Animated.Text} style={textStyle}>
          {props.title}
        </Text>
      </Stack>
    </RectButton>
  );
}

const Item = React.memo(SelectItem) as typeof SelectItem;

export default Language;
