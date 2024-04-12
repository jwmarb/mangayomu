import React from 'react';
import { Linking, View } from 'react-native';
import Icon from '@/components/primitives/Icon';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import Action from '@/screens/MangaView/components/primitives/Action';
import { styles } from '@/screens/MangaView/styles';
import useMangaViewManga from '@/screens/MangaView/hooks/useMangaViewManga';
import useIsInLibrary from '@/screens/MangaView/hooks/useIsInLibrary';

const READ_ICON = <Icon type="icon" name="book-play-outline" />;
const SAVE_ICON = <Icon type="icon" name="bookmark-outline" />;
const REMOVE_ICON = <Icon type="icon" name="bookmark" />;
const WEBVIEW_ICON = <Icon type="icon" name="web" />;

export default React.memo(function Actions() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const manga = useMangaViewManga();
  const [isInLibrary, setIsInLibrary] = useIsInLibrary(manga);

  const handleOnSave = React.useCallback(() => {
    setIsInLibrary((prev) => !prev);
  }, [setIsInLibrary]);

  const handleOnWebView = React.useCallback(() => {
    Linking.openURL(manga.link);
  }, [manga.link]);
  return (
    <View style={style.actionContainer}>
      <Action title="Read" icon={READ_ICON} />
      <Action
        title={isInLibrary ? 'Saved' : 'Save'}
        icon={isInLibrary ? REMOVE_ICON : SAVE_ICON}
        onPress={handleOnSave}
      />
      <Action title="WebView" icon={WEBVIEW_ICON} onPress={handleOnWebView} />
    </View>
  );
});
