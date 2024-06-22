import { View } from 'react-native';
import Text from '@/components/primitives/Text';
import { createStyles } from '@/utils/theme';
import useStyles from '@/hooks/useStyles';
import useContrast from '@/hooks/useContrast';
import ListItem from '@/screens/Home/tabs/More/components/primitives/ListItem';
import Icon from '@/components/primitives/Icon';

const styles = createStyles((theme) => ({
  container: {
    marginHorizontal: theme.style.screen.paddingHorizontal,
    borderRadius: theme.style.borderRadius.m,
    backgroundColor: theme.palette.background.paper,
    overflow: 'hidden',
  },
  title: {
    marginHorizontal: theme.style.screen.paddingHorizontal,
  },
}));

export default function SettingsList() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  return (
    <>
      <Text bold color="textSecondary" style={style.title}>
        Settings
      </Text>
      <View style={style.container}>
        <ListItem
          title="Appearance"
          icon={<Icon type="icon" name="palette" />}
          to="AppearanceSettings"
        />
        <ListItem
          title="Reader"
          icon={<Icon type="icon" name="book" />}
          to="ReaderSettings"
        />
      </View>
    </>
  );
}
