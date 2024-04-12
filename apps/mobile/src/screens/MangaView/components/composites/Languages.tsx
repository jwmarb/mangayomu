import React from 'react';
import { View } from 'react-native';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import Language from '@/screens/MangaView/components/primitives/Language';
import useMangaViewData from '@/screens/MangaView/hooks/useMangaViewData';
import useMangaViewSource from '@/screens/MangaView/hooks/useMangaViewSource';
import { createStyles } from '@/utils/theme';

const styles = createStyles((theme) => ({
  container: {
    flexDirection: 'row',
    gap: theme.style.size.m,
    alignItems: 'center',
    flexWrap: 'wrap',
  },
}));

export default React.memo(function Languages() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const data = useMangaViewData();
  const source = useMangaViewSource();
  const language = data?.language ?? source.DEFAULT_LANGUAGE;
  return (
    <>
      <Text>Supported languages</Text>
      <View style={style.container}>
        {/* Support for more languages in future */}
        <Language language={language} />
      </View>
    </>
  );
});
