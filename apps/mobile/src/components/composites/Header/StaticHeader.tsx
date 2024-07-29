import { styles } from '@/components/composites/Header/styles';
import Icon from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { NativeStackHeaderProps } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function StaticHeader(props: NativeStackHeaderProps) {
  const {
    options: { title },
    navigation,
  } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const handleOnBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };
  return (
    <SafeAreaView style={style.staticHeaderContainer} edges={['top']}>
      <IconButton
        onPress={handleOnBack}
        icon={<Icon type="icon" name="arrow-left" />}
      />
      <Text variant="h4">{title}</Text>
    </SafeAreaView>
  );
}
