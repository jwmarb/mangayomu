import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import { Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const styles = createStyles((theme) => ({
  container: {
    paddingVertical: theme.style.size.l,
    paddingBottom: Dimensions.get('window').height / 4,
  },
}));

export default function withScrollable<T extends React.JSX.IntrinsicAttributes>(
  Component: (props: T) => JSX.Element,
) {
  return function (props: T) {
    const contrast = useContrast();
    const style = useStyles(styles, contrast);
    return (
      <ScrollView contentContainerStyle={style.container}>
        <Component {...props} />
      </ScrollView>
    );
  };
}
