import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import ProfileCard from '@/screens/Home/tabs/More/components/ui/ProfileCard';
import SettingsList from '@/screens/Home/tabs/More/components/ui/SettingsList';
import { styles } from '@/screens/Home/tabs/More/styles';

export default function More() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const collapsible = useCollapsibleHeader({
    title: 'More',
  });
  return (
    <Screen collapsible={collapsible} contentContainerStyle={style.container}>
      <ProfileCard />
      <SettingsList />
    </Screen>
  );
}
