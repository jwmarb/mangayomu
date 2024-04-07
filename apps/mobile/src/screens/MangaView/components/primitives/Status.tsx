import { View } from 'react-native';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useMangaViewFetchStatus from '@/screens/MangaView/hooks/useMangaViewFetchStatus';
import { createStyles } from '@/utils/theme';

const styles = (color: string) =>
  createStyles((theme) => ({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.style.size.m,
    },
    indicator: {
      width: 8,
      height: 8,
      borderRadius: 1000,
      backgroundColor: {
        ...theme.palette.status,
        loading: theme.palette.text.disabled,
      }[color as keyof typeof theme.palette.status],
    },
  }));

const composedStyles = [
  'ongoing',
  'hiatus',
  'discontinued',
  'completed',
  'loading',
].reduce((prev, curr) => {
  prev[curr] = styles(curr);
  return prev;
}, {} as Record<string, ReturnType<typeof styles>>);

type StatusProps = {
  status?: string | null;
  type: string;
};

export default function Status(props: StatusProps) {
  const fetchStatus = useMangaViewFetchStatus();
  const { status, type } = props;
  const contrast = useContrast();
  const style = useStyles(
    composedStyles[
      (fetchStatus === 'fetching' ? 'loading' : status) ?? 'ongoing'
    ],
    contrast,
  );

  if (fetchStatus === 'fetching') {
    return null;
  }

  if (status != null) {
    return (
      <View style={style.container}>
        <View style={style.indicator} />
        <Text color="textSecondary" variant="chip" bold>
          {status[0].toUpperCase() + status.substring(1)}
        </Text>
        <Text variant="bottom-tab" color="textSecondary">
          ({type.toUpperCase()})
        </Text>
      </View>
    );
  }

  return null;
}
