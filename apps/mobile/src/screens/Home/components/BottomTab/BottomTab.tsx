import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { SafeAreaView } from 'react-native-safe-area-context';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/screens/Home/components/BottomTab/styles';
import Tab from '@/screens/Home/components/Tab';
import { HomeStackParamList } from '@/screens/Home/Home';

function BottomTab(props: BottomTabBarProps) {
  const { state, navigation } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const tabs = state.routes.map((route, index) => (
    <Tab
      key={route.key}
      routeName={route.name as keyof HomeStackParamList}
      isFocused={index === state.index}
      navigation={navigation}
    />
  ));
  return (
    <SafeAreaView edges={['bottom']} style={style.container}>
      {tabs}
    </SafeAreaView>
  );
}

export default (props: BottomTabBarProps) => <BottomTab {...props} />;
