import { View } from 'react-native';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import Icon from '@/components/primitives/Icon';
import Button from '@/components/primitives/Button';

const styles = createStyles((theme) => ({
  container: {
    marginHorizontal: theme.style.screen.paddingHorizontal,
    borderRadius: theme.style.borderRadius.m,
    backgroundColor: theme.palette.background.paper,
    paddingHorizontal: theme.style.size.xl,
    paddingVertical: theme.style.size.m,
    flex: 1,
    flexDirection: 'row',
    gap: theme.style.size.m,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
}));

export default function ProfileCard() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  return (
    <View style={style.container}>
      <Text>You are not signed in</Text>
      <Button title="Sign in" icon={<Icon type="icon" name="login" />} />
    </View>
  );
}
