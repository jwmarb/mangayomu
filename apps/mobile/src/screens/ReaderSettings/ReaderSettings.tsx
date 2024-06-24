import { ScrollView } from 'react-native-gesture-handler';
import GlobalSettings from '@/screens/ReaderSettings/components/ui/GlobalSettings';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/screens/ReaderSettings/styles';
import useContrast from '@/hooks/useContrast';

export default function ReaderSettings() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  return (
    <ScrollView contentContainerStyle={style.container}>
      <GlobalSettings />
    </ScrollView>
  );
}
