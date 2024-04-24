import { useNetInfo } from '@react-native-community/netinfo';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/screens/Home/tabs/Browse/styles';

export default function ListHeaderComponent() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const netInfo = useNetInfo();
  if (!netInfo.isInternetReachable)
    return (
      <Text color="warning" style={style.listHeadder} alignment="center">
        No internet available. Only cached results will be shown.
      </Text>
    );
  return null;
}
