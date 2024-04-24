import { View } from 'react-native';
import Image from '@/components/primitives/Image';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useMangaSource from '@/hooks/useMangaSource';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/screens/Home/tabs/Explore/components/ErrorSheet/styles';
import useExploreMangas from '@/screens/Home/tabs/Explore/hooks/useExploreMangas';
import { FetchedMangaResults, SourceError } from '@/stores/explore';

function SourceErrorComponent(props: { error: SourceError }) {
  const { error } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const source = useMangaSource({ source: error.source });
  return (
    <View style={style.errorContainer} key={error.source}>
      <Image source={{ uri: source.ICON_URI }} style={style.icon} />
      <View>
        <Text bold>{error.source}</Text>
        <Text color="error">{error.error}</Text>
      </View>
    </View>
  );
}

export default function tabGenerator(key: keyof FetchedMangaResults) {
  return function () {
    const { data } = useExploreMangas();
    const contrast = useContrast();
    const style = useStyles(styles, contrast);
    if (data == null) return null;
    return (
      <View style={style.container}>
        {data[key].errors.map((error) => (
          <SourceErrorComponent key={error.source} error={error} />
        ))}
      </View>
    );
  };
}
