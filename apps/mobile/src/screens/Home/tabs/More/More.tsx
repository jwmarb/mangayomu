import React from 'react';
import Screen from '@/components/primitives/Screen';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
const ProfileCard = React.lazy(
  () => import('@/screens/Home/tabs/More/components/ui/ProfileCard'),
);
const SettingsList = React.lazy(
  () => import('@/screens/Home/tabs/More/components/ui/SettingsList'),
);
import { styles } from '@/screens/Home/tabs/More/styles';
import { CodeSplitter } from '@/utils/codeSplit';

export default function More() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const collapsible = useCollapsibleHeader({
    title: 'More',
  });
  return (
    <CodeSplitter>
      <Screen collapsible={collapsible} contentContainerStyle={style.container}>
        <ProfileCard />
        <SettingsList />
      </Screen>
    </CodeSplitter>
  );
}
