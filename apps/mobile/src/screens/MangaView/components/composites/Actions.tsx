import React from 'react';
import { View } from 'react-native';
import { useDatabase } from '@nozbe/watermelondb/react';
import { Q } from '@nozbe/watermelondb';
import Icon from '@/components/primitives/Icon';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import Action from '@/screens/MangaView/components/primitives/Action';
import { styles } from '@/screens/MangaView/styles';
import useMangaViewManga from '@/screens/MangaView/hooks/useMangaViewManga';
import { Manga } from '@/models/Manga';
import { Table } from '@/models/schema';

const READ_ICON = <Icon type="icon" name="book-play-outline" />;
const SAVE_ICON = <Icon type="icon" name="bookmark-outline" />;
const REMOVE_ICON = <Icon type="icon" name="bookmark" />;
const WEBVIEW_ICON = <Icon type="icon" name="web" />;

export default React.memo(function Actions() {
  const contrast = useContrast();
  const database = useDatabase();
  const style = useStyles(styles, contrast);
  const manga = useMangaViewManga();
  const [isInLibrary, setIsInLibrary] = React.useState<boolean | null>(null);
  const row = React.useRef<Manga>();

  React.useEffect(() => {
    async function listener() {
      const mangas = database.get<Manga>(Table.MANGAS);
      const query = await mangas.query(Q.where('link', manga.link));
      if (query.length > 0) {
        const [found] = query;
        setIsInLibrary(!!found.isInLibrary);
      }
    }
    listener();
  }, []);

  React.useEffect(() => {
    async function changes() {
      if (isInLibrary == null) return;
      if (row.current == null) {
        row.current = await Manga.toManga(manga, database);
      }
      database.write(async () => {
        await row.current?.update((model) => {
          model.isInLibrary = isInLibrary ? 1 : 0;
        });
      });
    }

    changes();
  }, [isInLibrary]);

  const handleOnSave = React.useCallback(() => {
    setIsInLibrary((prev) => !prev);
  }, [setIsInLibrary]);
  return (
    <View style={style.actionContainer}>
      <Action title="Read" icon={READ_ICON} />
      <Action
        title={isInLibrary ? 'Saved' : 'Save'}
        icon={isInLibrary ? REMOVE_ICON : SAVE_ICON}
        onPress={handleOnSave}
      />
      <Action title="WebView" icon={WEBVIEW_ICON} />
    </View>
  );
});
