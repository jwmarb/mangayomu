import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import { useSelect } from 'react-cosmos/client';
import MaterialCommunityIcons from 'react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json';
import Icon from '@/components/primitives/Icon';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import Text from '@/components/primitives/Text';
import useModeSelect from '@/hooks/useModeSelect';
import { TEXT_COLORS, TextColors } from '@/components/primitives/types';

const styles = createStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
    justifyContent: 'center',
  },
  textContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.style.size.s,
  },
}));

export default function IconFixture() {
  const contrast = useModeSelect();
  const style = useStyles(styles, contrast);
  const [color] = useSelect('color', {
    options: TEXT_COLORS as unknown as string[],
    defaultValue: 'textPrimary',
  }) as unknown as [TextColors];
  const [name] = useSelect('icon-name', {
    options: Object.keys(MaterialCommunityIcons),
    defaultValue: 'ab-testing',
  }) as unknown as [keyof typeof MaterialCommunityIcons];
  return (
    <SafeAreaView style={style.container}>
      <View style={style.textContainer}>
        <Icon type="icon" name={name} size="small" color={color} />
        <Icon type="icon" name={name} size="medium" color={color} />
        <Icon type="icon" name={name} size="large" color={color} />
      </View>
      <View style={style.textContainer}>
        <Text variant="body2" color={color}>
          body2
        </Text>
        <Text color={color}>body1</Text>
        <Text variant="h3" color={color}>
          h3
        </Text>
      </View>
    </SafeAreaView>
  );
}
