import React from 'react';
import { View } from 'react-native';
import Icon from '@/components/primitives/Icon';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import Action from '@/screens/MangaView/components/primitives/Action';
import { styles } from '@/screens/MangaView/styles';

const READ_ICON = <Icon type="icon" name="book-play-outline" />;
const SAVE_ICON = <Icon type="icon" name="bookmark-outline" />;
const WEBVIEW_ICON = <Icon type="icon" name="web" />;

export default React.memo(function Actions() {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  return (
    <View style={style.actionContainer}>
      <Action title="Read" icon={READ_ICON} />
      <Action title="Save" icon={SAVE_ICON} />
      <Action title="WebView" icon={WEBVIEW_ICON} />
    </View>
  );
});
